# Complete Explanation of C Programs
## Set-wise and Program-wise Analysis

---

# SET-1

---

## Program 1: Program to Demonstrate Orphan Process

### Concept Explanation

**What is an Orphan Process?**
Imagine a parent and a child at a park. The parent suddenly leaves the park while the child is still playing. Who takes care of the child now? The park supervisor (caretaker) adopts the child.

In computers, this is called an orphan process. When a parent process finishes (exits) before its child finishes, the child becomes an "orphan". The operating system (specifically, the `init` process with PID 1) automatically adopts this orphan process.

**Key Concepts:**

1. **fork()**: A system call that creates a new process by duplicating the current one. After `fork()`, both the parent and child continue execution from the same point.

2. **Parent Process**: The original process that calls `fork()`.

3. **Child Process**: The new process created by `fork()`. It gets a copy of the parent's memory, file descriptors, etc.

4. **PID (Process ID)**: A unique number assigned to every running process in the system.

5. **PPID (Parent PID)**: The PID of the process that created this process.

6. **init process**: The first process started by the kernel at boot time (PID 1). It becomes the parent of orphan processes.

7. **How fork() returns**:
   - To the parent: returns the child's PID (a positive number)
   - To the child: returns 0
   - On failure: returns -1

### Line-by-Line Code Explanation

```c
#include <unistd.h>
```
**Explanation**: Include the UNIX standard library. This provides `fork()`, `getpid()`, `getppid()`, and `sleep()` functions. Think of it as a toolbox that contains all the UNIX-related tools our program needs.

```c
#include <stdio.h>
```
**Explanation**: Standard Input/Output library for `printf()` and `perror()`. This is like the "communication" library - it helps our program talk to the screen (print output).

```c
#include <stdlib.h>
```
**Explanation**: Standard library for `exit()`. This provides general utility functions.

```c
void main()
```
**Explanation**: The main function - entry point of every C program. `void` means this function doesn't return any value. The computer starts executing from here, like opening the front door of a house.

```c
{
    int pid;
```
**Explanation**: Declare an integer variable called `pid` that will store the value returned by `fork()`. This variable tells us whether we're in the parent or child process.

```c
    printf("Demonstration of fork() orphan\n");
```
**Explanation**: Print a message to the screen telling the user what this program does. `\n` is a newline character that moves the cursor to the next line.

```c
    pid = fork();
```
**Explanation**: This is the most important line! The `fork()` system call is made. Here's what happens:
- The operating system creates an exact copy of the current process
- Both processes continue from this line
- In the parent process: `pid` is set to the child's PID (a positive number)
- In the child process: `pid` is set to 0

Think of it like a photocopier making a copy of a document. Now you have two identical documents (processes) from the same original.

```c
    if (pid < 0)
```
**Explanation**: Check if `fork()` failed. If `pid` is negative, it means the system couldn't create a new process (maybe because memory is full or system limits are reached).

```c
    {
        perror("process not created");
```
**Explanation**: `perror()` prints an error message to the screen describing what went wrong. It automatically includes the system's error description (like "Cannot allocate memory").

```c
        exit(0);
```
**Explanation**: Exit the program immediately. The `0` indicates the program is exiting due to an error.

```c
    }
    else if (pid > 0)
```
**Explanation**: If `pid` is greater than 0, we are in the PARENT process. The parent received the child's PID as the return value.

```c
    {
        // Parent exits immediately without waiting
        printf("parent process\n");
        printf("from parent pid: %d\n", getpid());
```
**Explanation**: `getpid()` returns the PID of the currently running process. Here it returns the parent's PID. `%d` is a placeholder that gets replaced with the PID value.

```c
        printf("from parent ppid: %d\n", getppid());
```
**Explanation**: `getppid()` returns the PID of the PARENT of this process. For the parent process, this is the shell (terminal) that launched our program.

```c
        // Parent exits here — child becomes orphan adopted by init (PID 1)
    }
```
**Explanation**: Notice: the parent block does NOT call `wait()` or `sleep()`. The parent simply reaches the end of its block and exits immediately. This is the key to creating the orphan - the parent dies before the child finishes.

```c
    else if (pid == 0)
```
**Explanation**: If `pid` is 0, we are in the CHILD process. The child got 0 from `fork()`.

```c
    {
        sleep(1);           // Sleep so parent exits first
```
**Explanation**: `sleep(1)` makes the child pause for 1 second. This is crucial! It gives the parent time to exit first. After the parent exits, the child becomes an orphan, and the `init` process (PID 1) becomes its new parent.

```c
        system("ps -l");    // Shows child's new parent is PID 1
```
**Explanation**: `system("ps -l")` runs the UNIX command `ps -l` which shows process information. This will display that our child process now has PPID = 1 (adopted by init).

```c
        printf("child process\n");
        printf("from child pid: %d\n", getpid());
        printf("from child ppid: %d\n", getppid()); // Will print 1 (init)
```
**Explanation**: The child prints its own PID and its parent's PID. Since the original parent has already exited, `getppid()` will return 1 (the PID of the `init` process that adopted this orphan).

```c
    }
}
```
**Explanation**: End of if-else chain and end of main function.

---

## Program 2: Program for Producer-Consumer Problem Using Semaphores

### Concept Explanation

**What is the Producer-Consumer Problem?**
Imagine a factory with two workers:
- A **producer** who makes products and puts them in a storage room
- A **consumer** who takes products from the storage room and uses them

The storage room has a limited capacity. The producer can't put products in if the room is full, and the consumer can't take products if the room is empty.

In computers:
- **Producer**: A process that creates data and puts it in a buffer
- **Consumer**: A process that takes data from the buffer and processes it
- **Buffer**: A shared memory area (like the storage room)
- **Semaphores**: Special variables that control access to shared resources

**What are Semaphores?**
A semaphore is like a token or a counter. Think of it as a parking lot attendant:
- If there are empty spots, you can park (continue)
- If the lot is full, you wait until a spot opens up
- When you leave, you free up a spot for someone else

**Three Semaphores Used:**
1. **EMPTY**: Counts how many empty slots are in the buffer (starts at buffer size)
2. **FULL**: Counts how many filled slots are in the buffer (starts at 0)
3. **MUTEX**: Ensures only one process accesses the buffer at a time (binary semaphore, starts at 1)

**How it works:**
- Producer: waits for EMPTY > 0, then locks MUTEX, adds item, unlocks MUTEX, signals FULL
- Consumer: waits for FULL > 0, then locks MUTEX, removes item, unlocks MUTEX, signals EMPTY

### Line-by-Line Code Explanation

```c
#include <stdio.h>
#include <stdlib.h>
```
**Explanation**: Standard libraries for input/output (`printf`) and general utilities (`exit`, `atoi`).

```c
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <sys/shm.h>
#include <fcntl.h>
```
**Explanation**: These are IPC (Inter-Process Communication) libraries:
- `sys/types.h`: Defines data types used by system calls
- `sys/ipc.h`: IPC mechanism definitions (like keys)
- `sys/sem.h`: Semaphore functions (`semget`, `semop`, `semctl`)
- `sys/shm.h`: Shared memory functions
- `fcntl.h`: File control options

```c
#define FULL  0
#define EMPTY 1
#define MUTEX 2
#define KEY   50    // Replace with your roll number
```
**Explanation**: These are constants:
- `FULL = 0`, `EMPTY = 1`, `MUTEX = 2` are indices into the semaphore array
- `KEY = 50` is a unique number used to identify our semaphore set. Different programs use different keys so they don't interfere with each other. You should use your roll number.

```c
int semid;
int shmid;
```
**Explanation**: Global variables:
- `semid`: The semaphore set ID (identifies our group of 3 semaphores)
- `shmid`: Shared memory ID (declared but not actually used in this version)

```c
int sem_wait(int id, int index)
{
    struct sembuf operation;
    operation.sem_num = index;
    operation.sem_op  = -1;
    operation.sem_flg = 0;
    return semop(id, &operation, 1);
}
```
**Explanation**: This function performs a "wait" operation (decrement) on a semaphore:
- `struct sembuf` is a structure that describes a semaphore operation
- `sem_num = index`: Which semaphore to operate on (FULL, EMPTY, or MUTEX)
- `sem_op = -1`: Decrement the semaphore by 1 (this is the "wait" operation)
- `sem_flg = 0`: No special flags
- `semop(id, &operation, 1)`: Execute the operation on semaphore set `id`
- If the semaphore value is 0, the process BLOCKS (waits) until it becomes positive

Think of `sem_wait` as "take one token" - if no tokens are available, wait.

```c
int sem_signal(int id, int index)
{
    struct sembuf operation;
    operation.sem_num = index;
    operation.sem_op  = 1;
    operation.sem_flg = 0;
    return semop(id, &operation, 1);
}
```
**Explanation**: This function performs a "signal" operation (increment) on a semaphore:
- `sem_op = 1`: Increment the semaphore by 1
- This "releases" a token, allowing a waiting process to proceed

Think of `sem_signal` as "put back one token" - you're done using the resource.

```c
int main(int argc, char *argv[])
{
    int i, pid;
    int *shm_addr;
    int value = 0;

    if (argc < 2)
    {
        fprintf(stderr, "Usage: %s <buffer size>, positive number\n", argv[0]);
        exit(1);
    }

    i = atoi(argv[1]);
```
**Explanation**:
- `argc`: Number of command-line arguments
- `argv`: Array of argument strings
- We need the buffer size from the command line (e.g., `./a.out 5`)
- If user doesn't provide it, we print usage instructions and exit
- `atoi(argv[1])` converts the string argument to an integer

```c
    /* Create an array of 3 semaphores */
    semid = semget(KEY, 3, 0600 | IPC_CREAT);
```
**Explanation**: Create a semaphore set with 3 semaphores:
- `KEY`: The unique key to identify our semaphore set
- `3`: Number of semaphores (FULL, EMPTY, MUTEX)
- `0600`: Permissions (owner can read/write)
- `IPC_CREAT`: Create the semaphore set if it doesn't exist
- Returns a semaphore ID (`semid`) that we use in all semaphore operations

```c
    union semun
    {
        int val;
        struct semid_ds *buf;
        ushort *array;
    } arg;
```
**Explanation**: A `union` is a special data type that can hold different types of data in the same memory space. This particular union is used by `semctl()` to set semaphore values. It can hold:
- `val`: An integer value (used to set a single semaphore)
- `buf`: A pointer to semaphore info structure
- `array`: A pointer to an array of values

```c
    /* Set initial semaphore values */
    arg.val = i;
    semctl(semid, EMPTY, SETVAL, arg);  // EMPTY = buffer size
```
**Explanation**: Set the EMPTY semaphore to `i` (buffer size):
- `arg.val = i`: Set the value to the buffer size
- `semctl(semid, EMPTY, SETVAL, arg)`: Set the semaphore at index EMPTY to this value
- EMPTY starts at buffer size because initially all slots are empty

```c
    arg.val = 0;
    semctl(semid, FULL, SETVAL, arg);   // FULL  = 0
```
**Explanation**: Set FULL semaphore to 0 (initially no items in buffer).

```c
    arg.val = 1;
    semctl(semid, MUTEX, SETVAL, arg);  // MUTEX = 1
```
**Explanation**: Set MUTEX semaphore to 1 (initially buffer is free/available). A value of 1 means one process can enter the critical section.

```c
    pid = fork();
```
**Explanation**: Create a child process. After this, we have two processes:
- Child (pid == 0): Will act as Producer
- Parent (pid > 0): Will act as Consumer

```c
    if (pid == 0)   /* Producer — child process */
    {
        for (;;)
```
**Explanation**: This is the child process (Producer). `for (;;)` creates an infinite loop - the producer keeps producing forever.

```c
        {
            sem_wait(semid, EMPTY);
```
**Explanation**: Producer waits for an empty slot:
- Decrements the EMPTY semaphore
- If no empty slots are available (EMPTY == 0), the producer blocks here until a consumer creates an empty slot

```c
            sem_wait(semid, MUTEX);
```
**Explanation**: Producer waits to enter the critical section (buffer access):
- Only one process can hold the MUTEX at a time
- This ensures mutual exclusion - both producer and consumer can't access the buffer simultaneously

```c
            printf("Wrote %d in the buffer\n", value);
            value++;
```
**Explanation**: Producer "writes" the current value to the buffer (simulated by printing). Then increments the value.

```c
            sem_signal(semid, MUTEX);
```
**Explanation**: Producer releases the MUTEX, allowing the consumer to access the buffer.

```c
            sem_signal(semid, FULL);
```
**Explanation**: Producer signals that a new item is available:
- Increments the FULL semaphore
- If the consumer was waiting for an item, it can now proceed

```c
        }
    }
```
**Explanation**: End of producer loop and child process.

```c
    else            /* Consumer — parent process */
    {
        for (;;)
        {
            sleep(1);   // Lazy consumer
```
**Explanation**: Parent process (Consumer). `sleep(1)` makes the consumer wait 1 second each cycle. This simulates a "lazy" consumer that consumes slower than the producer produces.

```c
            sem_wait(semid, FULL);
```
**Explanation**: Consumer waits for a filled slot (an item to consume):
- Decrements FULL semaphore
- If no items available, consumer blocks here

```c
            sem_wait(semid, MUTEX);
```
**Explanation**: Consumer waits to enter the critical section.

```c
            printf("Read %d from the buffer\n", value);
            value++;
```
**Explanation**: Consumer "reads" the current value from the buffer and increments it.

```c
            sem_signal(semid, MUTEX);
```
**Explanation**: Consumer releases MUTEX.

```c
            sem_signal(semid, EMPTY);
```
**Explanation**: Consumer signals that an empty slot is now available (increments EMPTY).

```c
        }
    }
}
```
**Explanation**: End of consumer loop, parent process, and main function.

---

# SET-6

---

## Program 1: Program to Reposition File Offset Using lseek()

### Concept Explanation

**What is lseek()?**
Imagine reading a book with a bookmark. You can:
- Start from the beginning
- Skip ahead 50 pages
- Go back 10 pages
- Jump near the end

The `lseek()` function is like a bookmark for a file. It lets you move the "file pointer" (read/write position) to any location in the file without actually reading or writing data.

**Key Concepts:**

1. **File Descriptor**: An integer handle that represents an open file (like a book's ID number).

2. **File Offset**: The current position in the file where the next read or write will happen. Think of it as your finger pointing to a specific line in a book.

3. **SEEK_SET**: Move relative to the beginning of the file. `lseek(fd, 10, SEEK_SET)` means "go to byte 10 from the start".

4. **SEEK_CUR**: Move relative to the current position. `lseek(fd, 5, SEEK_CUR)` means "move 5 bytes forward from where we are now".

5. **SEEK_END**: Move relative to the end of the file. `lseek(fd, -6, SEEK_END)` means "go to 6 bytes before the end".

**Why is this useful?**
- Random access to files (like databases)
- Skip headers in a file
- Append data at specific locations
- Find the size of a file

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf`.

```c
#include <unistd.h>
```
**Explanation**: UNIX standard library for `read()`, `write()`, `lseek()`, `close()`.

```c
#include <fcntl.h>
```
**Explanation**: File control library for `open()` and flags like `O_RDONLY`.

```c
void main(int argc, char *argv[])
{
    int fd;
    char buff[32];
```
**Explanation**:
- `fd`: File descriptor (an integer) for the opened file
- `buff[32]`: A character buffer (temporary storage) to hold data we read from the file

```c
    fd = open(argv[1], O_RDONLY);
```
**Explanation**: Open the file specified in the command-line argument:
- `argv[1]` is the filename (e.g., "sample.txt")
- `O_RDONLY` means open for reading only
- Returns a file descriptor, or -1 if the file doesn't exist

```c
    // Read first 10 bytes from beginning (SEEK_SET position 0)
    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\n");
```
**Explanation**:
- `read(fd, buff, 10)`: Read 10 bytes from the current position (which is at the start) into the buffer
- `write(1, buff, 10)`: Write those 10 bytes to stdout (file descriptor 1 = screen)
- `printf("\n")`: Print a newline for formatting
- For "abcdefghijklmnopqrstuvwxyz", this prints "abcdefghij"

```c
    // Seek to byte 10 from start, then read 10 bytes
    lseek(fd, 10, SEEK_SET);
    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\n");
```
**Explanation**:
- `lseek(fd, 10, SEEK_SET)`: Move the file pointer to byte 10 from the start (0-indexed). Remember 0-based indexing: byte 0 = 'a', byte 10 = 'k'
- Read and print 10 bytes starting from position 10
- For "abcdefghijklmnopqrstuvwxyz", this prints "klmnopqrst"

```c
    // Seek 5 bytes forward from current position, then read 10 bytes
    lseek(fd, 5, SEEK_CUR);
    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\n");
```
**Explanation**:
- After the previous read, the file pointer is at position 20 (10 + 10)
- `lseek(fd, 5, SEEK_CUR)`: Move 5 bytes forward from current position (20 + 5 = 25)
- Read and print 10 bytes starting from position 25
- But the file only has 26 bytes (positions 0-25)! At position 25, only 'z' is available
- This prints just "z" followed by garbage or partial data

```c
    // Seek 6 bytes before end, read 5 bytes
    lseek(fd, -6, SEEK_END);
    read(fd, buff, 5);
    write(1, buff, 5);
```
**Explanation**:
- `lseek(fd, -6, SEEK_END)`: Move to 6 bytes before the end of the file
- For a 26-byte file, end is at position 26. -6 from end = position 20
- Read and print 5 bytes from position 20: 'u', 'v', 'w', 'x', 'y'
- This prints "uvwxy"

```c
    close(fd);
}
```
**Explanation**: Close the file descriptor. Always close files when done to free system resources.

---

## Program 2: Program to Simulate Least Recently Used (LRU) Page Replacement

### Concept Explanation

**What is Page Replacement?**
Imagine your desk has space for only 3 textbooks at a time. You need to study from 20 different books throughout the day. When your desk is full and you need a new book, you must remove one book to make space. Which book do you remove?

This is exactly what page replacement algorithms do in computer memory management.

**LRU (Least Recently Used):**
The LRU algorithm says: "Remove the book that was used the longest time ago." The idea is that if you haven't used a book in a while, you probably don't need it right now.

**Key Concepts:**

1. **Page**: A fixed-size block of memory. In this program, a "page" is represented by a number in the reference string.

2. **Reference String**: The sequence of pages that the program accesses. Like a list of book titles you need in order.

3. **Frame**: A slot in memory that can hold one page. The number of frames is the buffer size (like desk capacity).

4. **Page Fault**: When a required page is NOT in memory. This is "bad" - it means we need to load from disk (slow).

5. **Page Hit**: When a required page IS already in memory. This is "good" - we can access it immediately.

6. **LRU Replacement**: When a page fault occurs and all frames are full, replace the page that was used the longest time ago.

**Simple Example:**
Reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1
Frames: 3

- Start: [-, -, -] (empty frames)
- 7: [7, -, -] page fault (load 7)
- 0: [7, 0, -] page fault (load 0)
- 1: [7, 0, 1] page fault (load 1)
- 2: [2, 0, 1] page fault, replace 7 (7 was used least recently)
- 0: [2, 0, 1] page HIT (0 is already in frame)
- 3: [2, 0, 3] page fault, replace 1 (1 was used before 0)
- and so on...

### Line-by-Line Code Explanation

```c
#include <stdio.h>
#include <stdlib.h>
```
**Explanation**: Standard libraries for input/output (`printf`, `scanf`) and general utilities.

```c
int main()
{
    int i, j, n, rs[50], f[10], nf, k = 0, min;
    int avail, flag[20], pf = 0, next = 1, count[10];
```
**Explanation**: Variable declarations:
- `i, j`: Loop counters
- `n`: Number of pages in the reference string
- `rs[50]`: Array to store the reference string (up to 50 pages)
- `f[10]`: Array representing frames (up to 10 frames)
- `nf`: Number of frames
- `k`: Counter for how many frames are filled so far
- `min`: Index of the minimum count (LRU page)
- `avail`: (declared but not used)
- `flag[20]`: Marks if a page is a hit (1) or miss (0)
- `pf`: Page fault counter
- `next`: A counter that increases each time a page is used (used to track recency)
- `count[10]`: Stores the "time" when each frame's page was last used

```c
    printf("Enter no of pages\n");
    scanf("%d", &n);
```
**Explanation**: Ask the user how many pages are in the reference string and store the value in `n`.

```c
    printf("Enter the ref string\n");
    for (i = 1; i <= n; i++)
    {
        scanf("%d", &rs[i]);
        flag[i] = 0;
    }
```
**Explanation**: Read the reference string (sequence of page numbers):
- Store each page number in `rs[i]` (1-indexed for simplicity)
- Initialize all `flag[i]` to 0 (no pages have been processed yet)
- Example: `rs = [7, 0, 1, 2, 0, 3, ...]`

```c
    printf("Enter frame size\n");
    scanf("%d", &nf);
```
**Explanation**: Ask user for number of frames (slots in memory).

```c
    for (i = 0; i < nf; i++)
    {
        count[i] = 0;
        f[i] = -1;
    }
```
**Explanation**: Initialize frames and counters:
- `count[i] = 0`: All frames have "last used time" of 0 (not used yet)
- `f[i] = -1`: All frames are empty (-1 means no page loaded)

```c
    printf("Page Frames\n");
```
**Explanation**: Print header for output table.

```c
    for (i = 1; i <= n; i++)
    {
        flag[i] = 0;
```
**Explanation**: Start processing each page in the reference string. Reset the flag for this page.

```c
        // Check if page already in frame (HIT)
        for (j = 0; j < nf; j++)
        {
            if (f[j] == rs[i])
            {
                flag[i] = 1;
                count[j] = next;
                next++;
            }
        }
```
**Explanation**: Check if the current page (`rs[i]`) is already in any frame:
- Loop through all frames
- If a frame contains this page, it's a HIT
- Set `flag[i] = 1` to mark it as a hit
- Update the count for this frame to the current time (`next`)
- Increment `next` for the next operation

```c
        // Page MISS
        if (flag[i] == 0)
```
**Explanation**: If the page is NOT in any frame (flag is still 0), it's a page fault.

```c
        {
            if (k < nf)     // Frames not yet full
            {
                f[k] = rs[i];
                count[k] = next;
                next++;
                k++;
            }
```
**Explanation**: If frames are not yet full (we haven't filled all slots):
- Put the new page in the next available frame at index `k`
- Set its count to the current time
- Increment `k` (now one more frame is filled)

```c
            else            // Replace LRU page
            {
                min = 0;
                for (j = 1; j < nf; j++)
                    if (count[min] > count[j])
                        min = j;
```
**Explanation**: If all frames are full, we need to replace:
- Start by assuming frame 0 is the LRU (minimum count = least recently used)
- Loop through all frames
- Find the frame with the SMALLEST count value (the one used longest ago)

```c
                f[min] = rs[i];
                count[min] = next;
                next++;
            }
```
**Explanation**: Replace the LRU frame:
- Put the new page in the frame at index `min` (the LRU frame)
- Set its count to the current time
- Increment `next`

```c
            pf++;
        }
```
**Explanation**: Increment the page fault counter (we had a miss).

```c
        for (j = 0; j < nf; j++)
            printf("%d\t", f[j]);
```
**Explanation**: Print the current state of all frames (what pages are in each frame).

```c
        if (flag[i] == 0)
            printf("pf no is %d", pf);
```
**Explanation**: If this was a page fault, also print the page fault number.

```c
        printf("\n");
    }
```
**Explanation**: Print a newline and move to the next page in the reference string.

```c
    printf("No of page faults is %d\n", pf);
    return 0;
}
```
**Explanation**: Print the total number of page faults and return 0 (success).

---

# SET-10

---

## Program 1: Program for Echo Server Using Pipes

### Concept Explanation

**What is a Pipe?**
Imagine a tube connecting two cups (like a tin can phone). One person speaks into one cup, and the other person hears from the other cup. A pipe in Linux works the same way - it's a one-way communication channel between two processes.

**Key Concepts:**

1. **Pipe**: A unidirectional (one-way) communication channel. Data written to one end can be read from the other end.

2. **pipefd[2]**: An array of two file descriptors:
   - `pipefd[0]`: The read end of the pipe
   - `pipefd[1]`: The write end of the pipe

3. **Echo Server**: A server that simply sends back (echoes) whatever message it receives. Like a person who repeats everything you say.

**How it works:**
- Parent creates a pipe
- Parent forks a child
- Parent closes the read end, writes a message to the pipe
- Child closes the write end, reads the message from the pipe
- Child prints (echoes) the message

Think of it as: Parent puts a letter in a tube, child receives it at the other end and reads it out loud.

### Line-by-Line Code Explanation

```c
#include <unistd.h>
```
**Explanation**: UNIX standard library for `pipe()`, `fork()`, `read()`, `write()`, `close()`.

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf()`, `perror()`.

```c
#include <string.h>
```
**Explanation**: String library for `strlen()` (to get the length of the message).

```c
#include <sys/wait.h>
```
**Explanation**: Provides `wait(NULL)` which makes the parent wait for the child to finish.

```c
int main()
{
    int pipefd[2];
    char buffer[100];
    pid_t pid;
    char message[] = "hello from parent!";
```
**Explanation**: Variable declarations:
- `pipefd[2]`: Array to hold read (0) and write (1) ends of the pipe
- `buffer[100]`: Buffer to store the received message
- `pid`: Process ID returned by `fork()` (type `pid_t`)
- `message[]`: The string we'll send through the pipe

```c
    // Create a pipe
    if (pipe(pipefd) == -1)
    {
        perror("pipe");
        return 1;
    }
```
**Explanation**: Create a pipe:
- `pipe(pipefd)` creates a unidirectional data channel
- After this, `pipefd[0]` is the read end, `pipefd[1]` is the write end
- Returns -1 on failure

```c
    pid = fork();
```
**Explanation**: Create a child process. Both parent and child now have copies of the pipe file descriptors.

```c
    if (pid == -1)
    {
        perror("fork");
        return 1;
    }
```
**Explanation**: Check if fork failed.

```c
    if (pid == 0)       /* Child — acts as echo server */
    {
        close(pipefd[1]);                           // Close write end
```
**Explanation**: Child process:
- Closes the write end of the pipe (child only needs to read)
- Important: each process should close the end it doesn't use

```c
        read(pipefd[0], buffer, sizeof(buffer));    // Read message
```
**Explanation**: Read from the pipe:
- `pipefd[0]` is the read end
- Data is stored in `buffer`
- `sizeof(buffer)` = maximum bytes to read
- This blocks until data is available

```c
        printf("Echo from child: %s\n", buffer);   // Echo it back
        close(pipefd[0]);
    }
```
**Explanation**: The child prints (echoes) the received message and closes the read end.

```c
    else                /* Parent — client */
    {
        close(pipefd[0]);                                       // Close read end
```
**Explanation**: Parent process:
- Closes the read end (parent only needs to write)

```c
        write(pipefd[1], message, strlen(message) + 1);        // Send message
```
**Explanation**: Write the message to the pipe:
- `pipefd[1]` is the write end
- `message` is the string to send
- `strlen(message) + 1` = length including the null terminator (`\0`)
- The null terminator is important so the receiver knows where the string ends

```c
        printf("Parent sent: %s\n", message);
        close(pipefd[1]);
        wait(NULL);
    }
```
**Explanation**: 
- Print confirmation of what was sent
- Close the write end
- `wait(NULL)`: Parent waits for the child process to finish before continuing

```c
    return 0;
}
```
**Explanation**: Return 0 for successful completion.

---

## Program 2: Program to Simulate Shortest Job First (SJF) CPU Scheduling

### Concept Explanation

**What is SJF Scheduling?**
Imagine a doctor's clinic. The doctor can choose which patient to see next. Instead of seeing them in arrival order, the doctor asks "how long will your checkup take?" and sees the patient with the SHORTEST checkup time first.

This is SJF (Shortest Job First). The process with the smallest burst time (CPU time needed) gets the CPU first.

**Key Concepts:**

1. **Non-preemptive SJF**: Once a process gets the CPU, it runs to completion. It cannot be interrupted.

2. **Burst Time (BT)**: The total time a process needs to run on the CPU.

3. **Waiting Time (WT)**: Time a process spends waiting in the ready queue before getting CPU.

4. **Turnaround Time (TAT)**: Total time from arrival to completion = WT + BT.

**Analogy:**
At a grocery store with multiple checkout lines:
- Customer A: 10 items
- Customer B: 2 items  
- Customer C: 5 items

SJF would serve B first (2 items), then C (5 items), then A (10 items). This minimizes the average waiting time.

**Why sorting by burst time?**
To implement SJF, we must sort processes in ascending order of burst time. The shortest job runs first.

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf()` and `scanf()`.

```c
int main()
{
    int n, bt[20], wt[20], tut[20], twt = 0, ttt = 0, t = 0;
```
**Explanation**: Variable declarations:
- `n`: Number of processes
- `bt[20]`: Array of burst times
- `wt[20]`: Array of waiting times
- `tut[20]`: Array of turnaround times
- `twt`: Total waiting time (sum of all waiting times)
- `ttt`: Total turnaround time (sum of all turnaround times)
- `t`: Temporary variable for swapping during sorting

```c
    printf("Enter no. of processes: ");
    scanf("%d", &n);
```
**Explanation**: Ask user for number of processes.

```c
    printf("Enter burst times: ");
    for (int i = 0; i < n; i++)
        scanf("%d", &bt[i]);
```
**Explanation**: Read burst times for each process into the `bt` array.

```c
    // Sort processes by burst time (selection sort — SJF non-preemptive)
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (bt[j] < bt[i])
            {
                t = bt[i];
                bt[i] = bt[j];
                bt[j] = t;
            }
```
**Explanation**: Selection sort to arrange burst times in ascending order:
- Outer loop: for each position `i` in the array
- Inner loop: compare with all later positions `j`
- If `bt[j]` is smaller than `bt[i]`, swap them
- After sorting, the smallest burst time is at index 0, next at index 1, etc.
- This implements SJF because the shortest job runs first

The sorting uses a temporary variable `t` to swap values:
```
t = bt[i]      // Save current value
bt[i] = bt[j]  // Put smaller value in current position
bt[j] = t      // Put saved value in later position
```

```c
    // Calculate waiting time
    wt[0] = 0;
```
**Explanation**: The first process (shortest burst) has 0 waiting time because it runs immediately.

```c
    for (int i = 1; i < n; i++)
    {
        wt[i] = bt[i - 1] + wt[i - 1];
        twt += wt[i];
    }
```
**Explanation**: For each subsequent process:
- Waiting time = previous process's burst time + previous process's waiting time
- Think of it: the process must wait for ALL previous processes to finish
- Add to total waiting time

Example with sorted bursts [2, 5, 6, 8, 10]:
- wt[0] = 0
- wt[1] = 2 + 0 = 2
- wt[2] = 5 + 2 = 7
- wt[3] = 6 + 7 = 13
- wt[4] = 8 + 13 = 21

```c
    // Calculate turnaround time
    printf("\nProcess  BurstTime  WaitingTime  TurnAroundTime\n");
    for (int i = 0; i < n; i++)
    {
        tut[i] = wt[i] + bt[i];
        ttt += tut[i];
        printf("P%d\t%d\t%d\t%d\n", i + 1, bt[i], wt[i], tut[i]);
    }
```
**Explanation**: For each process:
- Turnaround Time = Waiting Time + Burst Time
- Add to total turnaround time
- Print all values in a formatted table
- `%d\t` prints an integer followed by a tab for spacing

```c
    printf("\nAverage Waiting Time     = %.2f\n", (float)twt / n);
    printf("Average Turn Around Time = %.2f\n", (float)ttt / n);
```
**Explanation**: Calculate and print averages:
- `(float)twt / n`: Convert total to float, then divide by n for average
- `%.2f`: Print float with 2 decimal places

Example with [2, 5, 6, 8, 10]:
- Total WT = 2 + 7 + 13 + 21 = 43
- Average WT = 43 / 5 = 8.60
- Total TAT = 2 + 7 + 13 + 21 + 31 = 74
- Average TAT = 74 / 5 = 14.80

```c
    return 0;
}
```
**Explanation**: Return 0 for successful completion.

---

# SET-14

---

## Program 1: Program to Demonstrate Parameter Passing in Threads

### Concept Explanation

**What are Threads?**
Think of a thread as a "mini-process" within a program. If a process is like a factory building, threads are the workers inside that building. They all share the same building (memory), but each does a different task.

**Why pass parameters to threads?**
When you create a thread, you often want to give it some data to work with. For example:
- "Thread #1, please calculate the sum of numbers 1 to 100"
- "Thread #2, please calculate the average"

**Key Concepts:**

1. **pthread_t**: A data type that represents a thread identifier (like a worker's ID badge).

2. **pthread_create()**: Creates a new thread. It needs:
   - Pointer to thread ID variable
   - Thread attributes (NULL = default)
   - The function the thread should run
   - Arguments to pass to that function

3. **pthread_join()**: Waits for a thread to finish (like waiting for a worker to complete their task).

4. **Structure**: A custom data type that groups multiple values together. Like a form with multiple fields.

5. **void***: A "generic" pointer that can point to any type of data. Thread functions must accept and return `void*`.

**The Problem:**
The thread function can only accept ONE argument (a `void*`). To pass multiple values, we bundle them into a structure and pass a pointer to that structure.

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf`.

```c
#include <pthread.h>
```
**Explanation**: POSIX threads library. Provides `pthread_t`, `pthread_create()`, `pthread_join()`. This is the library we need for multi-threading.

```c
#include <stdlib.h>
```
**Explanation**: Standard library for `malloc()` and `free()`.

```c
// Structure to pass multiple arguments to thread
struct threadargs
{
    int    id;
    double value;
    char  *message;
};
```
**Explanation**: Define a custom structure called `threadargs`:
- `id`: An integer (like a thread number)
- `value`: A double (floating-point number)
- `message`: A pointer to a string
- This structure bundles all the arguments into one package

Think of it like a labeled envelope containing multiple documents. Instead of handing over each document separately, you hand over the whole envelope.

```c
void *multiple_args_function(void *arg)
{
    struct threadargs *args = (struct threadargs *)arg;
```
**Explanation**: The thread function:
- `void *arg`: Receives a generic pointer (the envelope)
- `(struct threadargs *)arg`: Cast the generic pointer back to our structure type (open the envelope)
- `args`: Now we can access the individual fields

```c
    printf("Thread id: %d, value: %f, message: %s\n",
           args->id,
           args->value,
           args->message);
```
**Explanation**: Print the values from the structure:
- `args->id`: Access the `id` field using the arrow operator (->)
- `args->value`: Access the `value` field
- `args->message`: Access the `message` field
- `%f` formats a double (shows 3.140000 by default)

```c
    free(args);
    return NULL;
}
```
**Explanation**: 
- `free(args)`: Free the dynamically allocated memory (important to prevent memory leaks)
- `return NULL`: Thread function must return something (NULL here)

```c
int main()
{
    pthread_t tid;
```
**Explanation**: Declare a thread identifier variable `tid`. This will hold the ID of our new thread.

```c
    struct threadargs *args = malloc(sizeof(struct threadargs));
    if (args == NULL)
    {
        perror("failed to allocate memory");
        return 1;
    }
```
**Explanation**: 
- `malloc(sizeof(struct threadargs))`: Dynamically allocate memory for our structure. `malloc` returns a pointer to the allocated memory.
- Check if `malloc` returned NULL (allocation failed)
- `perror`: Print error message if allocation failed

```c
    args->id      = 1;
    args->value   = 3.14;
    args->message = "hello from main thread";
```
**Explanation**: Fill the structure with data:
- Set id to 1
- Set value to 3.14
- Set message to point to a string literal

```c
    pthread_create(&tid, NULL, multiple_args_function, (void *)args);
```
**Explanation**: Create a new thread:
- `&tid`: Store the thread ID here
- `NULL`: Default thread attributes (not changing anything)
- `multiple_args_function`: The function this thread will execute
- `(void *)args`: Pass our structure as the argument (cast to void*)

```c
    pthread_join(tid, NULL);
```
**Explanation**: Wait for the thread to finish:
- `tid`: The thread we're waiting for
- `NULL`: We don't care about the return value
- Main thread pauses here until `multiple_args_function` completes

```c
    return 0;
}
```
**Explanation**: Return 0 for success. Note: we don't need to free `args` here because the thread function already freed it.

---

## Program 2: Program to Demonstrate SSTF Algorithm in Disk Scheduling

### Concept Explanation

**What is Disk Scheduling?**
Imagine you're in an elevator in a building. People on different floors press the button to call the elevator. Which floor should you go to first? The closest one!

This is SSTF (Shortest Seek Time First) for disk scheduling. The disk arm moves to the request that is CLOSEST to its current position.

**Key Concepts:**

1. **Disk Head**: The read/write arm of a hard disk. It moves across the disk platter to read data.

2. **Seek Time**: The time it takes for the disk head to move from one position to another. This is the distance traveled.

3. **SSTF Algorithm**: Always service the request that is closest to the current head position. This minimizes seek time for each individual request.

4. **Absolute Distance**: `abs(current_position - request_position)` - always a positive number.

**Analogy:**
Think of a delivery driver who can deliver packages to different houses. Instead of following a fixed route, the driver always delivers to the nearest house first. This saves fuel (seek time) for each delivery.

**Difference from other algorithms:**
- FCFS: Service in the order requests arrive (like a queue)
- SSTF: Service the closest request first (like being opportunistic)
- SCAN: Move in one direction, servicing all requests along the way

### Line-by-Line Code Explanation

```c
#include <math.h>
```
**Explanation**: Math library for `abs()` function (absolute value). `-lm` flag is needed when compiling.

```c
#include <stdio.h>
#include <stdlib.h>
```
**Explanation**: Standard libraries.

```c
int main()
{
    int i, n, k, req[50], mov = 0;
    int cp, index[50], min, a[50], j = 0, mini, cp1;
```
**Explanation**: Variable declarations:
- `i, n, k`: Loop counters and number of requests
- `req[50]`: Array to store disk requests (cylinder numbers)
- `mov`: Total head movement (accumulated seek distance)
- `cp`: Current head position
- `index[50]`: Array storing absolute distances from current position to each request
- `min`: Minimum distance value
- `a[50]`: Array to store the service sequence (order of requests served)
- `j`: Index for the service sequence array
- `mini`: Index of the request with minimum distance
- `cp1`: Copy of the initial head position (for printing)

```c
    printf("Enter the current head position: ");
    scanf("%d", &cp);
```
**Explanation**: Read the starting position of the disk head.

```c
    printf("Enter the number of disk requests: ");
    scanf("%d", &n);
```
**Explanation**: Read how many disk requests are pending.

```c
    printf("Enter the request queue: ");
    for (i = 0; i < n; i++)
        scanf("%d", &req[i]);
```
**Explanation**: Read the request queue (cylinder numbers to access).

```c
    cp1 = cp;
```
**Explanation**: Save the initial head position for printing later.

```c
    // SSTF: always service the request nearest to current head
    for (k = 0; k < n; k++)
    {
```
**Explanation**: Main loop - for each request in the sequence, find the closest one.

```c
        // Compute absolute distances from current position
        for (i = 0; i < n; i++)
            index[i] = abs(cp - req[i]);
```
**Explanation**: Calculate the absolute distance from the current head position to each request:
- `abs(cp - req[i])` returns a positive number regardless of direction
- If head is at 53 and request is at 65, distance = 12
- If head is at 53 and request is at 37, distance = 16

```c
        // Find the minimum distance request
        min  = index[0];
        mini = 0;
```
**Explanation**: Start by assuming the first request has the minimum distance.

```c
        for (i = 1; i < n; i++)
        {
            if (min > index[i])
            {
                min  = index[i];
                mini = i;
            }
        }
```
**Explanation**: Loop through all distances to find the smallest one:
- If we find a smaller distance, update both `min` (the distance value) and `mini` (the index of that request)

```c
        a[j++] = req[mini];
        cp = req[mini];
```
**Explanation**: 
- Store the chosen request in the service sequence array `a`
- Update current position to the chosen request's position

```c
        req[mini] = 999;    // Mark as serviced
    }
```
**Explanation**: Mark the request as serviced by setting it to a very large number (999). This effectively removes it from consideration because:
- The distance will be huge (|cp - 999|)
- It will never be chosen as the minimum again

```c
    // Print sequence and total head movement
    printf("\nService Sequence: %d", cp1);
    mov += abs(cp1 - a[0]);
    printf(" -> %d", a[0]);
```
**Explanation**: Print the initial position and the first request served:
- `mov += abs(cp1 - a[0])`: Add the distance from initial position to first request

```c
    for (i = 1; i < n; i++)
    {
        mov += abs(a[i] - a[i - 1]);
        printf(" -> %d", a[i]);
    }
```
**Explanation**: For each subsequent request in the sequence:
- Add the distance from previous position to current request
- Print the current request in the sequence

```c
    printf("\nTotal head movement = %d\n", mov);
    return 0;
}
```
**Explanation**: Print the total seek distance and return.

**Example Walkthrough:**
Head at 53, requests: [98, 183, 37, 122, 14, 124, 65, 67]

Iteration 1: Distances from 53 → [45, 130, 16, 69, 39, 71, 12, 14]. Min = 12 (index 6, req 65). Sequence: [65]
Iteration 2: Distances from 65 → [33, 118, 28, 57, 51, 59, 999, 2]. Min = 2 (index 7, req 67). Sequence: [65, 67]
...and so on.

Total movement = |53-65| + |65-67| + |67-37| + |37-14| + |14-98| + |98-122| + |122-124| + |124-183| = 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = 236

---

# SET-18

---

## Program 1: Program to Demonstrate Round Robin CPU Scheduling

### Concept Explanation

**What is Round Robin Scheduling?**
Imagine a teacher asking questions to students in a circle. The teacher gives each student exactly 30 seconds to answer, then moves to the next student. If a student needs more time, they wait for their next turn. This continues until all students have answered fully.

Round Robin (RR) works the same way. Each process gets a fixed time slice (called a "time quantum") to use the CPU. If the process doesn't finish, it goes to the back of the queue and waits for its next turn.

**Key Concepts:**

1. **Time Quantum (Time Slice)**: The maximum amount of time each process can use the CPU in one turn.

2. **Context Switch**: When the CPU switches from one process to another (small overhead).

3. **Remaining Time**: How much CPU time a process still needs. Initially equals burst time.

4. **Preemptive**: Round Robin is preemptive - a process can be interrupted when its time quantum expires.

**Analogy:**
Think of a pizza with 4 people sharing it:
- Person 1 gets a slice, takes 2 bites (time quantum), passes the pizza
- Person 2 gets a slice, takes 2 bites, passes
- And so on, going around the circle
- Eventually, everyone finishes their pizza

**Advantage:**
- All processes get a fair share of the CPU
- No process starves (waits indefinitely)
- Good for interactive systems

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf`, `scanf`.

```c
int main()
{
    int n, ts, BT[20], wt[20], TAT[20], RT[20];
    int twt = 0, ttat = 0, i, t = 0, count = 0;
    float avgwt, avgTAT;
```
**Explanation**: Variable declarations:
- `n`: Number of processes
- `ts`: Time quantum (time slice)
- `BT[20]`: Burst times (original CPU time needed by each process)
- `wt[20]`: Waiting times (to be calculated)
- `TAT[20]`: Turnaround times (to be calculated)
- `RT[20]`: Remaining time (how much CPU time each process still needs)
- `twt`: Total waiting time (sum)
- `ttat`: Total turnaround time (sum)
- `t`: Current time (simulated clock)
- `count`: How many processes have finished
- `avgwt, avgTAT`: Average waiting and turnaround times (floats)

```c
    printf("Enter the number of processes: ");
    scanf("%d", &n);

    printf("Enter the time quantum (time slice): ");
    scanf("%d", &ts);
```
**Explanation**: Read number of processes and time quantum from user.

```c
    for (i = 1; i <= n; i++)
    {
        printf("Enter burst time of process P%d: ", i);
        scanf("%d", &BT[i]);
        RT[i] = BT[i];      // Remaining time = burst time initially
    }
```
**Explanation**: For each process (1-indexed for easier reading):
- Read burst time
- Set remaining time equal to burst time (no CPU time used yet)

```c
    // Simulate Round Robin
    while (count != n)
    {
```
**Explanation**: Main loop - continue until all processes have finished.

```c
        for (i = 1; i <= n; i++)
        {
            if (RT[i] > 0)
            {
```
**Explanation**: Loop through each process. If a process still has remaining time, give it CPU time.

```c
                if (RT[i] > ts)
                {
                    RT[i] -= ts;
                    t += ts;
                }
```
**Explanation**: If the process's remaining time is greater than the time quantum:
- Process uses its entire time quantum
- Subtract time quantum from remaining time
- Advance the clock by time quantum
- Process goes to the back of the queue (will be visited again in the next cycle)

```c
                else
                {
                    t += RT[i];
                    RT[i] = 0;
                    TAT[i] = t;
                    count++;
                }
```
**Explanation**: If the process can finish within the time quantum:
- Advance clock by the remaining time (less than or equal to time quantum)
- Set remaining time to 0 (process finished)
- Record the turnaround time (current clock time)
- Increment the finished process counter

```c
            }
        }
        if (count == n)
            break;
    }
```
**Explanation**: If all processes have finished, break out of the infinite while loop.

```c
    // Compute waiting time and averages
    for (i = 1; i <= n; i++)
    {
        wt[i]  = TAT[i] - BT[i];
        twt   += wt[i];
        ttat  += TAT[i];
    }
```
**Explanation**: For each process:
- Waiting Time = Turnaround Time - Burst Time
- (Because the time spent running is the burst time; the rest is waiting)
- Add to totals for averaging

```c
    avgwt  = (float)twt  / n;
    avgTAT = (float)ttat / n;
```
**Explanation**: Calculate averages by dividing totals by number of processes.

```c
    printf("\nProcess  BurstTime  WaitingTime  TurnAroundTime\n");
    for (i = 1; i <= n; i++)
        printf("P%d\t%d\t%d\t%d\n", i, BT[i], wt[i], TAT[i]);
```
**Explanation**: Print header and data rows for all processes.

```c
    printf("\nAverage Waiting Time     = %.2f\n", avgwt);
    printf("Average Turn Around Time = %.2f\n", avgTAT);
```
**Explanation**: Print averages formatted to 2 decimal places.

```c
    return 0;
}
```
**Explanation**: Return 0 for success.

**Example Walkthrough:**
Processes: P1(BT=5), P2(BT=4), P3(BT=2), P4(BT=7), Time Quantum = 2

Execution:
- Time 0-2: P1 runs (RT: 3), goes to back
- Time 2-4: P2 runs (RT: 2), goes to back
- Time 4-6: P3 runs (RT: 0), finishes at t=6, TAT=6
- Time 6-8: P4 runs (RT: 5), goes to back
- Time 8-10: P1 runs (RT: 1), goes to back
- Time 10-12: P2 runs (RT: 0), finishes at t=12, TAT=12
- Time 12-13: P1 runs (RT: 0), finishes at t=13, TAT=13
- Time 13-15: P4 runs (RT: 3), goes to back
- Time 15-17: P4 runs (RT: 1), goes to back
- Time 17-18: P4 runs (RT: 0), finishes at t=18, TAT=18

Waiting Times: P1=8, P2=8, P3=4, P4=11
Averages: WT=7.75, TAT=12.25

---

## Program 2: Program to Demonstrate Named Pipes (FIFO)

### Concept Explanation

**What are Named Pipes?**
Regular pipes (like in SET-10 Program 1) can only connect related processes (parent-child). Named pipes (FIFOs) are different - they have a NAME in the filesystem and can connect ANY two processes, even if they're unrelated.

Think of a named pipe like a public mailbox:
- Anyone who knows the mailbox's address can put mail in
- Anyone who knows the address can take mail out
- The mailbox persists even when no one is using it

**Key Concepts:**

1. **FIFO**: First In, First Out - data written first is read first.

2. **mkfifo()**: Creates a named pipe file in the filesystem. After creation, it appears as a special file (you can see it with `ls -l`).

3. **Two separate programs**: Unlike regular pipes (which need fork), named pipes can be used by completely separate programs running in different terminals.

4. **Blocking behavior**: 
   - Opening a FIFO for reading BLOCKS until a writer opens it
   - Opening a FIFO for writing BLOCKS until a reader opens it
   - This provides automatic synchronization

**Writer-Reader Model:**
- **Writer (npipew.c)**: Opens the FIFO for writing, reads input from keyboard, sends it through the pipe
- **Reader (npiper.c)**: Opens the FIFO for reading, receives data from the pipe, displays it

### Line-by-Line Code Explanation - Writer (npipew.c)

```c
#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>
#include <unistd.h>
```
**Explanation**: Include necessary libraries:
- `sys/types.h`: System data types
- `sys/stat.h`: For `mkfifo()` function
- `fcntl.h`: For file control flags like `O_WRONLY`
- `string.h`: For `strlen()`
- `unistd.h`: For `write()`, `close()`, `getpid()`

```c
int main()
{
    int  fd;
    char str1[100];
```
**Explanation**:
- `fd`: File descriptor for the named pipe
- `str1[100]`: Buffer to store input from keyboard

```c
    // Create the named pipe (FIFO)
    mkfifo("fifo", 0644);
    printf("Named pipe created\n");
```
**Explanation**: Create a named pipe called "fifo":
- `"fifo"`: The name of the pipe (appears as a file in the current directory)
- `0644`: Permissions (owner can read/write, others can read)
- `mkfifo` creates a special file type (p) instead of a regular file (-)

```c
    while (1)
    {
```
**Explanation**: Infinite loop - the writer keeps running forever.

```c
        fd = open("fifo", O_WRONLY);    // Open for writing
```
**Explanation**: Open the FIFO for writing:
- `O_WRONLY`: Write-only mode
- This BLOCKS until a reader opens the other end
- If no reader is running, this hangs here waiting

```c
        fgets(str1, 100, stdin);        // Read input from keyboard
```
**Explanation**: Read a line of input from the keyboard:
- `fgets(str1, 100, stdin)`: Reads up to 100 characters from standard input (keyboard)
- Stores the input in `str1` including the newline character

```c
        write(fd, str1, strlen(str1) + 1);
```
**Explanation**: Write the input string to the FIFO:
- `fd`: File descriptor of the pipe
- `str1`: The data to write
- `strlen(str1) + 1`: Length including the null terminator

```c
        close(fd);
        printf("user1 (PID %d) has sent the data\n", getpid());
```
**Explanation**: Close the FIFO and print a confirmation message showing the writer's process ID.

```c
    }

    return 0;
}
```
**Explanation**: End of while loop and main function.

### Line-by-Line Code Explanation - Reader (npiper.c)

```c
#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>
#include <unistd.h>
```
**Explanation**: Same libraries as the writer. Both programs need the same header files.

```c
int main()
{
    int  fd;
    char str2[100];
```
**Explanation**:
- `fd`: File descriptor for the named pipe
- `str2[100]`: Buffer to store received data

```c
    // Create/open the named pipe
    mkfifo("fifo", 0644);
    printf("Named pipe created\n");
```
**Explanation**: Create the named pipe. Note: if the pipe already exists (created by writer), `mkfifo` returns an error but the program still works because `open` will open the existing pipe.

```c
    while (1)
    {
```
**Explanation**: Infinite loop - the reader keeps running forever.

```c
        fd = open("fifo", O_RDONLY);    // Open for reading
```
**Explanation**: Open the FIFO for reading:
- `O_RDONLY`: Read-only mode
- This BLOCKS until a writer opens the other end
- Reader waits here until writer sends data

```c
        read(fd, str2, sizeof(str2));
```
**Explanation**: Read data from the FIFO:
- `read(fd, str2, sizeof(str2))`: Reads up to 100 bytes into `str2`
- This BLOCKS until data is available

```c
        printf("user2 received: %s\n", str2);
        close(fd);
```
**Explanation**: Print the received message and close the FIFO.

```c
    }

    return 0;
}
```
**Explanation**: End of while loop and main function.

**How to Run:**
```
# Terminal 1 (Writer):
cc -o npw npipew.c
./npw

# Terminal 2 (Reader):
cc -o npr npiper.c
./npr
```

The writer reads from keyboard and sends through the FIFO. The reader receives and displays the data in real-time. This is a simple chat-like communication between two independent processes.

---

# Compilation Summary

| Set | Program | Compile Command |
|-----|---------|----------------|
| SET-1 | Orphan Process | `cc orphan.c` |
| SET-1 | Producer-Consumer | `cc producerconsumer.c` |
| SET-6 | lseek Demo | `cc lseekdemo.c` |
| SET-6 | LRU Page Replacement | `cc lru.c` |
| SET-10 | Echo Server (Pipes) | `cc echo_pipe.c` |
| SET-10 | SJF Scheduling | `cc sjf.c` |
| SET-14 | Thread Parameter Passing | `cc threadparam.c -lpthread` |
| SET-14 | SSTF Disk Scheduling | `cc disksstf.c -lm` |
| SET-18 | Round Robin Scheduling | `cc roundrobin.c` |
| SET-18 | Named Pipes (Writer) | `cc -o npw npipew.c` |
| SET-18 | Named Pipes (Reader) | `cc -o npr npiper.c` |

---

# Summary of All Concepts Covered

## Process Management
- **fork()**: Create a child process
- **Orphan Process**: Child whose parent exits before it
- **init (PID 1)**: Adopts orphan processes
- **getpid()/getppid()**: Get process IDs

## Inter-Process Communication (IPC)
- **Pipes**: Unidirectional communication between parent-child
- **Named Pipes (FIFOs)**: Communication between any processes
- **mkfifo()**: Create a named pipe
- **Semaphores**: Synchronization mechanism for shared resources

## CPU Scheduling
- **SJF**: Shortest Job First (non-preemptive)
- **Round Robin**: Time-sharing with fixed time quantum
- **Burst Time, Waiting Time, Turnaround Time**: Performance metrics

## Memory Management
- **LRU Page Replacement**: Replace least recently used page
- **Page Fault**: When a required page is not in memory

## File Operations
- **lseek()**: Reposition file offset
- **SEEK_SET, SEEK_CUR, SEEK_END**: Seek origins

## Disk Scheduling
- **SSTF**: Shortest Seek Time First
- **Total Head Movement**: Distance traveled by disk arm

## Threads
- **pthread_create/pthread_join**: Thread creation and synchronization
- **Parameter Passing**: Using structures to pass multiple arguments

---

*This explanation file covers all programs from SET-1, SET-6, SET-10, SET-14, and SET-18 as specified in os-lab-program-codes.md*
