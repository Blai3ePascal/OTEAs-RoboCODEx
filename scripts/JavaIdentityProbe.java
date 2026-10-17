// SPDX-License-Identifier: MIT
import java.nio.file.*;
import otea.ArenaBridge;
public class JavaIdentityProbe {
  public static void main(String[] args) throws Exception {
    ArenaBridge.boot(args[0],args[1],false);
    String cp=System.getProperty("java.class.path");
    for(int i=2;i<args.length;i+=2){
      String result=ArenaBridge.compileNamed(Files.readString(Path.of(args[i])),cp,args[i+1]);
      if(!result.equals("OK:"+args[i+1]))throw new AssertionError(result);
      System.out.println(result);
    }
    if(!ArenaBridge.compileNamed("public class Invalid {}",cp,"../../Invalid").startsWith("ERROR:"))throw new AssertionError("Invalid identity accepted");
    String battle=ArenaBridge.battle(args[3]+","+args[5],1,800,800,100,0.1,450);
    if(battle.contains("\"type\":\"error\""))throw new AssertionError(battle);
    System.out.println("IDENTITY_PROBE_OK");
    System.exit(0);
  }
}
