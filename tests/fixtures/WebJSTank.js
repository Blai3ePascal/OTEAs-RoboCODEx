async function run(robot) {
  for (let i = 0; i < 8; i++) {
    await robot.ahead(20);
    await robot.turnRight(45);
    await robot.fire(1);
    await robot.wait(15);
  }
}
