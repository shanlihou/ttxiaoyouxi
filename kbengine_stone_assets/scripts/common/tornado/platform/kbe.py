'''
Created on 2016年9月14日

@author: Xiao
'''
import KBEngine
from tornado.ioloop import IOLoop, PollIOLoop
from KBEDebug import *

class _Select(object):
    
    def __init__(self):
        self._active = {}
        self._readable = set()
        self._writeable = set()

    def close(self):
        pass

    def register(self, fd, events):
        INFO_MSG('register fd %d' %(fd))
        if events & IOLoop.READ:
            KBEngine.registerReadFileDescriptor(fd, self.onRecv)
        elif events & IOLoop.WRITE:
            KBEngine.registerWriteFileDescriptor(fd, self.onWrite)
            
        self._active[fd] = events    
        
    def modify(self, fd, events):
        self.unregister(fd)
        self.register(fd, events)

    def unregister(self, fd):
        INFO_MSG('unregister fd %d' %(fd))
        events = self._active.pop(fd)
        if events & IOLoop.READ:
            KBEngine.deregisterReadFileDescriptor(fd)
        elif events & IOLoop.WRITE:
            KBEngine.deregisterWriteFileDescriptor(fd)
    
    def onRecv(self, fd):
        self._readable.add(fd)
    
    def onWrite(self, fd):
        self._writeable.add(fd)
    
    def poll(self, timeout):
        events = {}
        for fd in self._readable:
            events[fd] = events.get(fd, 0) | IOLoop.READ
        for fd in self._writeable:
            events[fd] = events.get(fd, 0) | IOLoop.WRITE
            
        for fd,event in events.items():
            self._readable.discard(fd)
            self._writeable.discard(fd)
        return events.items()

class KBEIOLoop(PollIOLoop):
    def initialize(self, **kwargs):
        super(KBEIOLoop, self).initialize(impl=_Select(), **kwargs)
        