---
id: java
title: JAVA API
sidebar_label: JAVA
---

## Administrating tables
### Overview
Administration commands can be run py passing configuration SQL to the compiler. 

### Syntax
<!--DOCUSAURUS_CODE_TABS-->
<!--java-->
```java
CairoConfiguration configuration = new DefaultCairoConfiguration("/tmp/my_database");
BindVariableService bindVariableService = new BindVariableService();
try (Engine engine = new Engine(configuration)) {
    try (SqlCompiler compiler = new SqlCompiler(engine, configuration)) {
        compiler.compile(
            "YOUR_SQL_HERE"
        );
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->


`configuration` holds various settings that can be overridden via a subclass. 
Most importantly configuration is bound to the database root - directory where table sub-directories will be created.

`engine` is a concurrent pool of table readers and writers.

`compiler` is the entry point for QuestDB's SQL engine.

### Example
The following will create a new table abc with the specifications set below.

<!--DOCUSAURUS_CODE_TABS-->
<!--java-->
```java
CairoConfiguration configuration = new DefaultCairoConfiguration("/tmp/my_database");
BindVariableService bindVariableService = new BindVariableService();
try (Engine engine = new Engine(configuration)) {
    try (SqlCompiler compiler = new SqlCompiler(engine, configuration)) {
        compiler.compile(
                "create table abc (" +
                        "a INT, " +
                        "b BYTE, " +
                        "c SHORT, " +
                        "d LONG, " +
                        "e FLOAT, " +
                        "f DOUBLE, " +
                        "g DATE, " +
                        "h BINARY, " +
                        "t TIMESTAMP, " +
                        "x SYMBOL, " +
                        "z STRING, " +
                        "y BOOLEAN" +
                        ") timestamp(t) partition by MONTH", 
        );
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

### Other admin commands.
See the language section related to admin commands.

## Running Queries
### Overview
Querying data is a three-step process:

1 - Compile the SQL text to an instance of `RecordCursorFactory`, an instance that encapsulates execution plan. You can 
run custom SQL queries by instantiating `RecordCursorFactory` to `compiler.compile("YOUR_SQL_HERE")`

2 - Create a `RecordCursor` instance using a factory from step 1.

3 - Iterate on `RecordCursor` to read the data.

### Example
~~~ java
final CairoEngine engine = new Engine(new DefaultCairoConfiguration(""));
final SqlCompiler compiler = new SqlCompiler(engine);
final RecordCursorFactory factory = compiler.compile("select * from table");
final RecordCursor cursor = factory.getCursor();
final Record record = cursor.getRecord();

while(cursor.hasNext()) {
    record.getInt(0);
    ...
}
~~~

### Component life cycle
1 - **Engine**

This is a thread-safe, concurrent and non-blocking pool of TableReader and TableWriter instances. 
Ideally, there should be only one per database location.

2 - **SqlCompiler**

This is a totally single-threaded, factory-style instance

3 - **RecordCursorFactory**

Execution plan of respective SQL, also single-threaded. 
The instance is reusable as far as the creation of RecordCursor is concerned and should be 
retained until data access is no longer needed. It can be closed explicitly via close() method.

4 - **RecordCursor**

This is a data iterator. The cursor has a fixed record instance, which is a moving window on the data set. `next()`
calls push this "window" down one record at a time.


<aside class="important">
<p> The `RecordCursor` must be explicitly released when no longer required in order to free up the system's resources.
</p>
</aside>

## Writing data
### Overview
The `TableWriter` facilitates table writes. To successfully create an instance of `TableWriter`, the table must:
- already exist
- have no other open writers against it as the `TableWriter` constructor will attempt to obtain an exclusive 
cross-process lock on the table.

### Example

~~~ java
try (TableWriter writer = engine.getWriter("abc")) {
    for (int i = 0; i < 10; i++) {
        TableWriter.Row row = writer.newRow(Os.currentTimeMicros());
        row.putInt(0, 123);
        row.putByte(1, (byte) 1111);
        row.putShort(2, (short) 222);
        row.putLong(3, 333);
        row.putFloat(4, 4.44f);
        row.putDouble(5, 5.55);
        row.putDate(6, System.currentTimeMillis());
        // skip 7 - see separate function to write blobs
        // skip 8 - timestamp is already set via newRow() call
        row.putSym(9, "xyz");
        row.putStr(10, "abc");
        row.putBool(11, true);
        row.append();
    }
    writer.commit();
}
~~~

### Detailed Steps
Detailed steps are:

1 - Create an instance of TableWriter. In this case, we use engine but we can also use TableWriter constructor directly.
~~~ java
try (TableWriter writer = engine.getWriter("abc")) {
~~~
The `writer` instance must be eventually released to release resources. 
In this case, it will be released back to the engine for re-use. 
Constructing a new writer is a resource-intensive operation and it will allocate memory on JVM heap. 
Writers lifecycles should be carefully considered for your particular use case.

2 - Create a new row
~~~ java
TableWriter.Row row = writer.newRow(Os.currentTimeMicros());
~~~
Although this operation semantically looks like a new object creation, the row instance is actually being re-used under 
the hood. A Timestamp is necessary to determine a partition for the new row. Its value has to be 
either increment or stay the same as the last row. When the table is not partitioned and does not have a 
designated timestamp column, timestamp value can be 0, e.g.
~~~ java
TableWriter.Row row = writer.newRow(0);
~~~

3 - Populate row columns
There are put* methods for every supported data type. Columns are updated by an index for performance reasons:
~~~ java 
row.putLong(3, 333);
~~~ 

Column update order is not important and update can be sparse. All unset columns will default to NULL values.

4 - Append row
It is a trivial and lightweight method call:

~~~ java
row.append();
~~~
Appended rows are not visible to readers until they are committed. An unneeded row can also be canceled if required.
~~~ java
row.cancel();
~~~

A pending row is automatically cancelled when `writer.newRow()` is called.

5 - Commit changes
`writer.commit` commits changes, which makes them visible to readers. 
This method call is atomic and has a complexity of O(1).

