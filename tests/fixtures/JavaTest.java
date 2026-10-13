package classroom;
import robocode.*;
public class JavaTest extends Robot {
  public void run() {
    while (true) {
      ahead(60);
      turnRight(90);
      turnGunRight(360);
    }
  }
  public void onScannedRobot(ScannedRobotEvent e) { fire(2); }
  public void onHitWall(HitWallEvent e) { back(30); turnRight(90); }
}
