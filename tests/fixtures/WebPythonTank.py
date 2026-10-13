async def run(robot):
    for i in range(8):
        await robot.ahead(20)
        await robot.turnRight(45)
        await robot.fire(1)
        await robot.wait(15)
