// SPDX-License-Identifier: MIT
package otea;
import java.io.*;
import java.nio.file.*;
import java.util.regex.*;
import java.util.zip.*;
import robocode.control.*;
import robocode.control.events.*;
import robocode.control.snapshot.*;

/** Runs the unmodified Robocode engine. No Java source rewriting or translation. */
public final class ArenaBridge {
  private static File home;
  private static RobocodeEngine engine;
  private static boolean nativeMode = false;
  private static volatile int maxTurns = 3000;
  public static native void emit(String json);
  private static void send(String json) { if(nativeMode) emit(json); else System.out.println(json); }
  private static String quote(String s) {
    if(s==null)return "\"\"";
    return "\""+s.replace("\\","\\\\").replace("\"","\\\"").replace("\n","\\n").replace("\r","\\r").replace("\t","\\t")+"\"";
  }
  public static String boot(String archive, String directory, boolean browser) throws Exception {
    nativeMode=browser; home=new File(directory); home.mkdirs();
    System.setProperty("robocode.home",home.getAbsolutePath());
    System.setProperty("robocode.security.off","true");
    System.setProperty("java.awt.headless","true");
    try(ZipInputStream zip=new ZipInputStream(new FileInputStream(archive))) {
      ZipEntry e;
      while((e=zip.getNextEntry())!=null) {
        File f=new File(home,e.getName());
        if(!f.getCanonicalPath().startsWith(home.getCanonicalPath()+File.separator))throw new IOException("Invalid ZIP path");
        if(e.isDirectory()){f.mkdirs();continue;}
        f.getParentFile().mkdirs();
        try(OutputStream out=new FileOutputStream(f)){byte[] b=new byte[65536];int n;while((n=zip.read(b))>0)out.write(b,0,n);}
      }
    }
    return "Robocode 1.11.1 · JVM lista";
  }
  public static String compile(String source, String classPath) throws Exception {
    Matcher cls=Pattern.compile("public\\s+(?:final\\s+)?class\\s+([A-Za-z_$][\\w$]*)").matcher(source);
    if(!cls.find())return "ERROR: falta una clase public class Nombre";
    String name=cls.group(1), pkg="";
    Matcher pm=Pattern.compile("(?m)^\\s*package\\s+([\\w.]+)\\s*;").matcher(source);
    if(pm.find())pkg=pm.group(1);
    File robots=new File(home,"robots"), path=new File(robots,pkg.replace('.',File.separatorChar));path.mkdirs();
    File file=new File(path,name+".java");
    Files.write(file.toPath(), source.getBytes("UTF-8"));
    StringWriter errors=new StringWriter(), log=new StringWriter();
    org.eclipse.jdt.internal.compiler.batch.Main compiler = new org.eclipse.jdt.internal.compiler.batch.Main(new PrintWriter(log),new PrintWriter(errors),false) {
      protected java.util.ArrayList<org.eclipse.jdt.internal.compiler.batch.FileSystem.Classpath> handleBootclasspath(java.util.ArrayList<String> paths,String encoding) {
        if(System.getProperty("otea.symbols")==null)return super.handleBootclasspath(paths,encoding);
        java.util.ArrayList<org.eclipse.jdt.internal.compiler.batch.FileSystem.Classpath> result=new java.util.ArrayList<>();
        processPathEntries(4,result,System.getProperty("otea.symbols"),encoding,false,true);
        return result;
      }
    };
    boolean ok=compiler.compile(new String[]{"-17","-encoding","UTF-8","-proc:none","-classpath",classPath+File.pathSeparator+robots.getAbsolutePath(),"-d",robots.getAbsolutePath(),file.getAbsolutePath()});
    if(!ok)return "ERROR:\n"+errors.toString()+log.toString();
    String fullName=(pkg.isEmpty()?"":pkg+".")+name;
    try(java.net.URLClassLoader loader=new java.net.URLClassLoader(new java.net.URL[]{robots.toURI().toURL()},ArenaBridge.class.getClassLoader())) {
      Class<?> type=Class.forName(fullName,false,loader);
      if(!robocode.Robot.class.isAssignableFrom(type)&&!robocode.JuniorRobot.class.isAssignableFrom(type))return "ERROR: la clase debe ser un robot Robocode (Robot o AdvancedRobot).";
      if(java.lang.reflect.Modifier.isAbstract(type.getModifiers()))return "ERROR: el robot no puede ser abstracto.";
      type.getConstructor();
    }catch(Throwable invalid){return "ERROR: robot no válido: "+invalid.toString();}
    return "OK:"+fullName;
  }
  private static String frame(ITurnSnapshot t) {
    StringBuilder s=new StringBuilder("{\"type\":\"frame\",\"tick\":").append(t.getTurn()).append(",\"round\":").append(t.getRound()).append(",\"robots\":[");
    boolean comma=false;
    for(IRobotSnapshot r:t.getRobots()) {
      if(comma)s.append(',');comma=true;
      s.append("{\"id\":").append(r.getRobotIndex()).append(",\"name\":").append(quote(r.getVeryShortName())).append(",\"x\":").append(r.getX()).append(",\"y\":").append(r.getY()).append(",\"heading\":").append(r.getBodyHeading()*180/Math.PI).append(",\"gun\":").append(r.getGunHeading()*180/Math.PI).append(",\"radar\":").append(r.getRadarHeading()*180/Math.PI).append(",\"energy\":").append(r.getEnergy()).append(",\"heat\":").append(r.getGunHeat()).append(",\"alive\":").append(!r.getState().toString().equals("DEAD")).append(",\"color\":").append(quote(String.format("#%06x",r.getBodyColor()&0xffffff))).append('}');
    }
    s.append("],\"bullets\":[");comma=false;
    for(IBulletSnapshot b:t.getBullets()) {
      if(comma)s.append(',');comma=true;
      s.append("{\"x\":").append(b.getX()).append(",\"y\":").append(b.getY()).append(",\"owner\":").append(b.getOwnerIndex()).append(",\"heading\":").append(b.getHeading()*180/Math.PI).append(",\"power\":").append(b.getPower()).append(",\"explosion\":").append(b.isExplosion()).append('}');
    }
    return s.append("]}").toString();
  }
  public static String battle(String names, int rounds, int width, int height, int turns, double cooling, long inactivity) {
    try {return battleInternal(names,rounds,width,height,turns,cooling,inactivity);}
    catch(Throwable error){String result="{\"type\":\"error\",\"message\":"+quote(error.toString())+"}";send(result);return result;}
  }
  private static String battleInternal(String names, int rounds, int width, int height, int turns, double cooling, long inactivity) throws Exception {
    maxTurns=turns;
    if(engine!=null){engine.close();engine=null;}
    engine=new RobocodeEngine(home);engine.setVisible(false);
    final boolean[] capped={false};
    final String[] result={""};
    final java.util.concurrent.CountDownLatch finished=new java.util.concurrent.CountDownLatch(1);
    engine.addBattleListener(new BattleAdaptor(){
      public void onTurnEnded(TurnEndedEvent event) {
        ITurnSnapshot t=event.getTurnSnapshot();
        if(t.getTurn()%2==0)send(frame(t));
        if(t.getTurn()>=maxTurns&&!capped[0]){capped[0]=true;engine.abortCurrentBattle();finished.countDown();}
      }
      public void onBattleError(BattleErrorEvent e){send("{\"type\":\"error\",\"message\":"+quote(e.getError())+"}");}
      public void onBattleCompleted(BattleCompletedEvent event) {
        StringBuilder s=new StringBuilder("{\"type\":\"result\",\"engine\":\"Robocode 1.11.1\",\"scores\":[");boolean comma=false;
        for(robocode.BattleResults r:event.getSortedResults()){
          if(comma)s.append(',');comma=true;
          s.append("{\"name\":").append(quote(r.getTeamLeaderName())).append(",\"score\":").append(r.getScore()).append(",\"survival\":").append(r.getSurvival()).append(",\"damage\":").append(r.getBulletDamage()).append(",\"firsts\":").append(r.getFirsts()).append('}');
        }
        result[0]=s.append("]}").toString();send(result[0]);finished.countDown();
      }
    });
    java.util.List<RobotSpecification> selected=new java.util.ArrayList<>();
    java.util.Set<String> requested=new java.util.HashSet<>(java.util.Arrays.asList(names.split(",")));
    for(RobotSpecification rs:engine.getLocalRepository())if(requested.contains(rs.getClassName()))selected.add(rs);
    RobotSpecification[] robots=selected.toArray(new RobotSpecification[0]);
    if(robots.length<2)throw new IllegalArgumentException("Se necesitan al menos dos robots compilados y distintos: "+names+" (encontrados "+robots.length+")");
    BattleSpecification spec=new BattleSpecification(new BattlefieldSpecification(width,height),rounds,inactivity,cooling,0,false,robots);
    engine.runBattle(spec,false);
    if(!finished.await(120,java.util.concurrent.TimeUnit.SECONDS)&&!capped[0]){engine.abortCurrentBattle();throw new IOException("La partida JVM ha superado el tiempo de espera.");}
    if(capped[0]){result[0]="{\"type\":\"result\",\"capped\":true,\"scores\":[]}";send(result[0]);}
    return result[0];
  }
  public static void abort(){if(engine!=null)engine.abortCurrentBattle();}
  public static void main(String[] args)throws Exception{
    boot(args[0],args[1],false);
    String cp=System.getProperty("java.class.path");
    System.out.println(compile("package classroom; import robocode.*; public class TestTank extends Robot {public void run(){while(true){ahead(100);turnRight(90);turnGunRight(360);}} public void onScannedRobot(ScannedRobotEvent e){fire(2);}}",cp));
    System.out.println(battle("classroom.TestTank,sample.SittingDuck",1,800,600,1500,0.1,450));
    System.exit(0);
  }
}
