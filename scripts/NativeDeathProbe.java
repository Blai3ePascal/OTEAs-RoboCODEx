// SPDX-License-Identifier: MIT
public class NativeDeathProbe {
 public static void main(String[] args) throws Exception {
  otea.ArenaBridge.boot(args[0],args[1],false);
  System.out.println(otea.ArenaBridge.compile("package probe; import robocode.*; public class Cazador extends Robot { public void run(){setColors(java.awt.Color.BLUE,java.awt.Color.CYAN,java.awt.Color.ORANGE);while(true)turnGunRight(360);} public void onScannedRobot(ScannedRobotEvent e){double giro=e.getBearing()+getHeading()-getGunHeading();turnGunRight((giro+540)%360-180);fire(3);} }",System.getProperty("java.class.path")));
  otea.ArenaBridge.battle("probe.Cazador,sample.SittingDuck",1,800,800,1800,.1,450);
  System.exit(0);
 }
}
