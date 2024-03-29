---
id: storagemodel
title: Storage Model
sidebar_label: Storage Model
---

## Intro
QuestDB uses a **column-based** storage model. Data is stored in tables with each column stored in its own file
 and its native format. New data is appended to the bottom of each column 
 to allow data to be organically retrieved in the same order versus ingestion. 
 
 Optionally, tables can be physically partitioned by timestamps.  In this case, 
 for each nominated time interval, the data is stored in separate sets of files. 
 
 Our SQL optimiser leverages partitioning to reduce disk IO for timestamps interval searches. 
 Moreover, the SQL optimiser leverages the chronology of the table data to optimise timestamp interval 
 search.
 
![alt-text](assets/storage-model.png)
 
## Writing data
 To guarantee **atomicity**, each table maintains a `last_committed_record_count` in a separate file. 
 By convention, any table reader will never read more records than  `tx_count`. 
 This enables the property `isolation`: where uncommitted data cannot be read. 
 Since uncommitted data is appended directly to the table, 
 **QuestDB’s transaction size is only limited by the available disk space.**
 
 Once all data is appended, QuestDB `commit()` ensures that the 
 `tx_count` is updated atomically in multi-threaded and multi-process environments. 
 It does so lock-free to ensure minimal impact on concurrent reads. 
 This method ensures the **atomicity** of the data store.
 
 The **consistency** assurance of the data store is limited to 
 QuestDB auto-repairing abnormally terminated transactions. 
 We do not yet support user-defined constraints, checks and triggers.
 
 **Durability** is in line with all other database solutions `commit()` can optionally invoke `msync()`
 with a choice of synchronous or asynchronous IO.

![alt-text](assets/storage-model-2.png)
 
## Appending Model
QuestDB appends one column at a time and each one is updated using the same method. 
The tail of column file is mapped into the memory page in RAM and the column append is effectively a 
memory write at an address. Once the memory  page is exhausted it is unmapped (thus writing data to disk) 
and the new page is mapped at a new append offset.
 
This method ensures minimum resource churn and consistent append latency. 
 
![alt-text](assets/column-read.png)
  
## Read Model
Table columns are randomly accessible. Columns with fixed size data types are read by translating 
record number into file offset by a simple bit shift. Offset in column file is then translated into 
offset in a lazily mapped memory page, where the required value is read from.
  
![alt-text](assets/column-update.png)

## Summary
To summarise, our storage model uses memory mapped files and cross-process atomic transaction updates, 
which allow to using QuestDB as a low overhead method of interprocess communication. Data committed by 
one process can be instantaneously read by another process either randomly via queries or incrementally 
as data queue. QuestDB provides a variety of reader implementations. 
   
![alt-text](assets/storage-summarized.png)