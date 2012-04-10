# Python imports
import time

# Requests imports
import requests


# Consts
LIMIT = 1000
TICKRATE = 50.0/60.0
TICK = 1.0/TICKRATE
DESTINATION_URL = 'http://localhost:533'
FAILURE_LIMIT = 20


def create_account(url = DESTINATION_URL):
    try:
        r = requests.get(url)
    except Exception as e:
        print ("HTTP Exception : %s" % e)
        return False

    if r.ok:
        print("HTTP Success : %s" % r.content)
        return True
    
    print("HTTP Failure : %s" % r.content)
    return False




def main():
    x = None
    failure_counter = 0
    for i in range(LIMIT):
        print("TICK : %d, %d failures" % (i, failure_counter))
        success = create_account()
        if not success:
            failure_counter += 1
        # Sleep
        time.sleep(TICK)
        x = i
        if failure_counter >= FAILURE_LIMIT:
            break


    print("Finished creating %d accounts with %d failures" % (x, failure_counter))

if __name__ == '__main__':
    main()