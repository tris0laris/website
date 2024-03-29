---
id: run
title: Running QuestDB
sidebar_label: Running QuestDB
---

## Windows
QuestDB can either be run as a program or as a service. You can start it out of the box with default
configuration, or customise parameters as you start.

### Start

Launch a new `cmd.exe` windowa and navigate to where to where you extracted tar.gz :

```shell script
C:\cd questdb-1.0.2

C:\questdb-1.0.2>dir
Volume in drive C has no label.
Volume Serial Number is 9CD8-DB1D

Directory of C:\questdb-1.0.2

26/10/2016  19:33    &lt;DIR&gt;          .
26/10/2016  19:33    &lt;DIR&gt;          ..
02/08/2016  22:04            35,179 LICENSE.txt
26/10/2016  19:33    &lt;DIR&gt;          qdbroot
26/10/2016  13:32            75,322 questdb.exe
26/10/2016  16:10         3,107,733 questdb.jar
19/10/2016  20:44             5,206 questdb.sh
              4 File(s)      3,223,440 bytes
              3 Dir(s)  796,188,151,808 bytes free
</pre>

Then run the launcher as follows
<pre class="term">
C:\questdb-1.0.2&gt;questdb.exe
```


Response:
```shell script
<pre class="term">
QuestDB HTTP Server 1.0.2
Listening on 0.0.0.0:9000 [HTTP plain]
```



### Start (as a service)
Simply run `questdb.exe` as Administrator.
>When QuestDB is run as a service, the default home directory is `C:\Windows\System32\questdb`


### Stop


Simply press <kbd>Ctrl</kbd>+<kbd>C</kbd> in `cmd` window.

When run from console QuestDB server home is `qdbroot` in current directory.

## MacOS

### Start

```shell script
mbp:~ user$ questdb start
```
>

Response:
```shell script
QuestDB HTTP Server 1.0
Listening on 0.0.0.0:9000 [HTTP plain]
```


### Stop
```shell script
mpb:~ user$ questdb stop
```

Response:
```shell script
Stopped 82395
```



### Start with a different home directory:
```shell script
mbp:~ user$ questdb start -d $HOME/.questdb
```

Response:
```shell script
QuestDB HTTP Server 1.0
Listening on 0.0.0.0:9000 [HTTP plain]
```



## Linux
> Make sure JAVA_HOME environment variable is exported and points at a valid Java8 directory

> When running on Linux, QuestDB will run in the background and continue running even if you close the session.

By default QuestDB home directory will be $HOME/.questdb. You can change this location with `-d` command line switch.

### Start
The launch script is `questdb.sh`. The questdb.exe is a part of multi-platform package, you can ignore or delete it.
Start QuestDB as follows:

```shell script
user@ubuntu:~$ cd questdb-1.0.2/
user@ubuntu:~/questdb-1.0.2$ ./questdb.sh start
```

Response:
```shell script
Listening on 0.0.0.0:9000 [HTTP plain]
```


### Stop
Response:
```shell script
user@ubuntu:~/questdb-1.0.2$ ./questdb.sh stop
```

Response:
```shell script
Stopped 4631
```


## Launch Options

Windows launches supports the following commands and options:


```shell script
<em>Usage: C:\questdb-1.0.2\questdb.exe 
[start|stop|status|install|remove] [-d dir] [-f] [-j JAVA_HOME] [-t tag]</em>
```



<table class="alt">
<thead>

<th>Command</th>
<th>Comments</th>

</thead>
<tbody>
<tr>
<td><code>start</code></td>
<td>Starts windows service. Default service name is <code>QuestDB</code></td>
</tr>
<tr>
<td><code>stop</code></td>
<td>Stops windows service</td>
</tr>
<tr>
<td><code>status</code></td>
<td>Shows service status. This command is useful for troubleshooting service problems. It prints RUNNING or
INACTIVE if service is started or stopped respectively.</td>
</tr>
<tr>
<td><code>install</code></td>
<td>Installs windows service. Default name is <code>QuestDB</code>. Windows service names have to be unique. If
you would like to run multiple instances of QuestDB you have to use <code>-t</code> option.</td>
</tr>
<tr>
<td><code>remove</code></td>
<td>Removes windows service</td>
</tr>
</tbody>
</table>


<table class="alt">
<thead>

<th>Option</th>
<th>Comments</th>

</thead>
<tbody>
<tr>
<td><code>-j</code></td>
<td>Path to Java SDK directory. By default QuestDB uses value of JAVA_HOME environment variable.</td>
</tr>
<tr>
<td><code>-d</code></td>
<td>Path to QuestDB home directory</td>
</tr>
<tr>
<td><code>-t</code></td>
<td>Service name suffix tag. <code>-t X</code> will create <code>QuestDB:X</code> service name. This option
can be used with all commands.</td>
</tr>
</tbody>
</table>
