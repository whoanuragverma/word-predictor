import os
import time

def autoComplete(str):
    f = open("storage/data.txt",'w')
    f.write(str)
    f.close()
    time.sleep(0.3)
    f = open("storage/out.txt",'r')
    lines = f.readlines()
    l = []
    for i in range(0,len(lines)):
        l.append(list(lines[i].split("\n"))[0])
    f.close()
    return l
