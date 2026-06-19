# Complete Explanation of C Programs
## Set-wise and Program-wise Analysis

---

# SET-3

---

## Program 1: File Copy (Using Standard I/O Library)

### Concept Explanation

**What is File Copying?**
Imagine you have a notebook and you want to make an exact copy of every page into a new notebook. You would read each line from the original notebook and write the same line into the new one, page by page, until you've copied everything.

In computers, this is exactly what file copying does. The computer reads data from one file (source) and writes the same data to another file (destination), byte by byte or character by character.

**Key Concepts to Understand:**

1. **File**: A file is like a digital container that stores data (text, images, etc.) on your computer's storage (hard drive, SSD).

2. **File Pointer/FILE pointer**: In C, when you want to work with a file, you need a "handle" to access it. This handle is called a `FILE *`. Think of it like a remote control for a TV - you use the remote (FILE pointer) to control the TV (file).

3. **fopen()**: This function "opens" a file, like opening a book to read it. It takes two arguments: the filename and the mode (read "r", write "w", etc.).

4. **fgetc()**: This stands for "file get character" - it reads ONE character from a file. Each time you call it, it gives you the next character.

5. **fputc()**: This stands for "file put character" - it writes ONE character to a file.

6. **EOF**: End Of File - a special marker that tells us when we've reached the end of the file.

7. **argc and argv**: These are command-line arguments. `argc` tells how many words were typed in the command, and `argv[]` is an array containing each word. If you type `cp source.txt dest.txt`, then `argv[0]` is "cp", `argv[1]` is "source.txt", and `argv[2]` is "dest.txt".

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: This line tells the computer to include a "library" called `stdio.h`. A library is like a toolbox that contains ready-made tools (functions) for working with input and output. `stdio.h` contains functions like `printf`, `fopen`, `fgetc`, etc. Without this, the computer wouldn't know what `printf` or `fopen` means.

```c
#include <stdlib.h>
```
**Explanation**: This includes another library called `stdlib.h`. This library provides general utility functions like `exit()` which stops the program immediately.

```c
int main(int argc, char *argv[]) {
```
**Explanation**: Every C program starts with a `main` function. Think of it as the front door of your program - the computer starts executing from here.
- `int` means this function will return an integer number when it finishes (0 usually means "success")
- `argc` = "argument count" - how many words were typed in the command
- `argv` = "argument values" - an array/list of those words

```c
FILE *src, *dst;
```
**Explanation**: We declare two "file handles" (pointers):
- `src` will be our source file (the file we're copying FROM)
- `dst` will be our destination file (the file we're copying TO)
- `FILE *` is the data type for file pointers in C

```c
char ch;
```
**Explanation**: We create a variable called `ch` of type `char` (character). This will hold one character at a time as we copy. We'll read a character into this variable, then write it out.

```c
if (argc != 3) {
```
**Explanation**: We check if the user provided exactly 3 command-line arguments. Why 3?
- `argv[0]` = the program name itself (like "cp")
- `argv[1]` = source filename
- `argv[2]` = destination filename
If the user didn't provide 3 arguments, we show them how to use the program.

```c
printf("Usage: %s <source_file> <dest_file>\n", argv[0]);
```
**Explanation**: This prints a helpful message to the user:
- `%s` is a placeholder that gets replaced by `argv[0]` (the program name)
- `\n` moves to a new line
- So if program is called "file_copy", it prints: "Usage: file_copy <source_file> <dest_file>"

```c
exit(1);
```
**Explanation**: This immediately stops the program. The number 1 indicates that something went wrong (an error occurred). A 0 would mean success.

```c
src = fopen(argv[1], "r");
```
**Explanation**: We try to open the source file (argv[1]) in read mode ("r").
- `fopen` returns a FILE pointer if successful
- "r" means open for reading only
- If file doesn't exist, fopen returns NULL (nothing)

```c
if (src == NULL) {
```
**Explanation**: We check if the file opening failed. NULL means "nothing" or "failed". If `src` is NULL, the file couldn't be opened.

```c
perror("Error opening source file");
```
**Explanation**: If there was an error opening the file, `perror` prints a helpful error message describing what went wrong. It automatically includes the reason (like "No such file or directory").

```c
exit(1);
```
**Explanation**: Stop the program with error status.

```c
dst = fopen(argv[2], "w");
```
**Explanation**: We open/create the destination file (argv[2]) in write mode ("w").
- "w" means write mode
- If the file doesn't exist, it creates it
- If the file already exists, it ERASES all content and starts fresh
- Returns NULL if fails

```c
if (dst == NULL) {
```
**Explanation**: Check if destination file opening failed.

```c
fclose(src);
```
**Explanation**: If we couldn't open the destination file, we need to close the source file that we already opened. This is important to avoid "memory leaks" - where the computer thinks a file is still in use.

```c
perror("Error opening destination file");
exit(1);
```
**Explanation**: Print error message and exit.

```c
while ((ch = fgetc(src)) != EOF) {
```
**Explanation**: This is the main copying loop! Let's break it down:
1. `fgetc(src)` reads one character from the source file
2. `ch =` assigns that character to the variable `ch`
3. `!= EOF` checks if we haven't reached the end of the file
4. The loop continues as long as we haven't hit EOF

This loop runs: read one character → check if it's EOF → if not, continue

```c
fputc(ch, dst);
```
**Explanation**: We write the character `ch` to the destination file. `fputc` writes one character at a time.

```c
}
```
**Explanation**: End of the while loop.

```c
printf("File copied successfully.\n");
```
**Explanation**: After the loop ends (we've copied all characters), we print a success message.

```c
fclose(src);
fclose(dst);
```
**Explanation**: We close both files to tell the computer we're done using them. This is important - always close files when you're done!

```c
return 0;
}
```
**Explanation**: Return 0 to indicate the program finished successfully, and close the main function.

---

## Program 2: FCFS (First Come First Serve) CPU Scheduling

### Concept Explanation

**What is CPU Scheduling?**
Imagine a pizza shop with a line of customers waiting to order. The first person in line gets served first, then the second, and so on. This is exactly "First Come First Serve" (FCFS).

In computers, the CPU (Central Processing Unit - the computer's brain) needs to execute processes (programs/tasks). FCFS is a simple way to decide which process goes first - whoever requests the CPU first gets to use it first.

**Key Concepts:**

1. **Process**: A process is a program that is currently running. When you open a web browser, game, or any application, it becomes a process.

2. **Burst Time (BT)**: The amount of time a process needs to use the CPU. Some tasks take longer than others.

3. **Waiting Time (WT)**: How long a process waits in the queue before getting to use the CPU.

4. **Turnaround Time (TAT)**: The total time from when a process arrives until it completes. It's calculated as: Waiting Time + Burst Time.

5. **Gantt Chart**: A visual diagram showing how processes are scheduled on the CPU over time.

**Simple Example:**
If three students need to complete a test:
- Student A arrives first and takes 10 minutes
- Student B arrives second and takes 5 minutes
- Student C arrives third and takes 8 minutes

Using FCFS: A goes first (waits 0 min), then B (waits 10 min), then C (waits 15 min)

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Include the standard input/output library for `printf` and `scanf`.

```c
struct Process {
```
**Explanation**: We create a custom data type called `struct Process`. Think of it as a form/template that holds information about each process. A structure is like a container that holds multiple pieces of information together.

```c
int pid;
```
**Explanation**: Process ID - a unique number assigned to each process to identify it (like a student's roll number).

```c
int bt; // Burst Time
```
**Explanation**: Burst Time - how long this process needs to run on the CPU. Comment explains this is BT.

```c
int wt; // Waiting Time
```
**Explanation**: Waiting Time - how long this process waits before getting CPU time. This will be calculated.

```c
int tat; // Turnaround Time
```
**Explanation**: Turnaround Time - total time from arrival to completion. This will be calculated.

```c
};
```
**Explanation**: The closing brace and semicolon end our structure definition.

```c
void calculateTimes(struct Process p[], int n) {
```
**Explanation**: We define a function to calculate waiting time and turnaround time for all processes.
- `void` means this function doesn't return any value
- `struct Process p[]` - we pass an array of processes
- `int n` - the number of processes

```c
p[0].wt = 0;
```
**Explanation**: The first process (at index 0) has 0 waiting time because it arrives first and goes directly to CPU.

```c
p[0].tat = p[0].bt;
```
**Explanation**: Turnaround time for first process = Burst Time (because it doesn't wait at all). Formula: TAT = Waiting Time + Burst Time = 0 + Burst Time.

```c
for (int i = 1; i < n; i++) {
```
**Explanation**: We start from the second process (index 1) and calculate for each one. The first process is already done.

```c
p[i].wt = p[i-1].wt + p[i-1].bt;
```
**Explanation**: For each process:
- Waiting Time = Previous Process's Waiting Time + Previous Process's Burst Time
- Think of it: you have to wait for all previous processes to finish

```c
p[i].tat = p[i].wt + p[i].bt;
```
**Explanation**: Turnaround Time = Waiting Time + Burst Time. Total time from arrival to completion.

```c
}
```
**Explanation**: End of for loop.

```c
int main() {
```
**Explanation**: Start of main function.

```c
int n;
```
**Explanation**: Variable to store number of processes.

```c
printf("Enter number of processes: ");
scanf("%d", &n);
```
**Explanation**:
- `printf` displays the message asking for number of processes
- `scanf("%d", &n)` reads an integer from the user and stores it in `n`. The `&` means "address of n" - where to store the input.

```c
struct Process p[n];
```
**Explanation**: We create an array of `n` processes. Each process has its own pid, bt, wt, and tat.

```c
for (int i = 0; i < n; i++) {
```
**Explanation**: Loop to get burst time for each process.

```c
p[i].pid = i + 1;
```
**Explanation**: Assign process ID (1, 2, 3, etc.) instead of 0, 1, 2 for user-friendliness.

```c
printf("Enter burst time for P%d: ", p[i].pid);
```
**Explanation**: Ask user to enter burst time for each process. `%d` gets replaced with process ID (1, 2, 3...).

```c
scanf("%d", &p[i].bt);
```
**Explanation**: Read the burst time and store it in `p[i].bt`.

```c
}
```
**Explanation**: End of input loop.

```c
calculateTimes(p, n);
```
**Explanation**: Call the function we defined earlier to calculate waiting and turnaround times.

```c
float avg_wt = 0, avg_tat = 0;
```
**Explanation**: Declare variables to store average waiting time and average turnaround time. `float` is used for decimal numbers.

```c
printf("\nPID\tBT\tWT\tTAT\n");
```
**Explanation**: Print a header row with column names:
- `\n` = new line
- `\t` = tab (spacing)
- Output looks like: "PID    BT    WT    TAT"

```c
for (int i = 0; i < n; i++) {
```
**Explanation**: Loop through all processes to display their details and sum them up.

```c
avg_wt += p[i].wt;
avg_tat += p[i].tat;
```
**Explanation**: Add each process's waiting time and turnaround time to our sum. `+=` means "add to existing value".

```c
printf("%d\t%d\t%d\t%d\n", p[i].pid, p[i].bt, p[i].wt, p[i].tat);
```
**Explanation**: Print one row of data for this process with all values separated by tabs.

```c
}
```
**Explanation**: End of display loop.

```c
printf("\nAverage Waiting Time: %.2f", avg_wt / n);
```
**Explanation**: Print average waiting time. `%.2f` formats the float to show 2 decimal places.

```c
printf("\nAverage Turnaround Time: %.2f\n", avg_tat / n);
```
**Explanation**: Print average turnaround time.

```c
return 0;
}
```
**Explanation**: Return 0 to indicate successful completion.

---

# SET-7

---

## Program 1: File Copy (Using System Calls)

### Concept Explanation

**What are System Calls?**
System calls are like "direct messages" to the operating system's kernel. While the standard library (stdio) provides easy-to-use functions, system calls give you more direct control.

Think of it like this:
- Using `fopen/fgetc/fputc` is like ordering food through a waiter (restaurant staff)
- Using `open/read/write` system calls is like going directly to the kitchen

Both get you food, but one gives you more control (and more responsibility!).

**Key Differences from Set-3 Program 1:**
- Uses `open()` instead of `fopen()`
- Uses `read()` instead of `fgetc()`
- Uses `write()` instead of `fputc()`
- Uses file descriptors (integers) instead of FILE pointers
- File descriptors are just numbers (0, 1, 2, 3...) that refer to open files
- We use a buffer to read chunks of data at once instead of one character at a time

**Buffer**: A temporary storage area in memory. Instead of reading ONE character at a time (slow), we read a chunk of 1024 bytes at once (fast).

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O library for `printf`, `fprintf`.

```c
#include <fcntl.h>
```
**Explanation**: This library provides the `open()` function and file control flags like `O_RDONLY`, `O_WRONLY`, `O_CREAT`, etc.

```c
#include <unistd.h>
```
**Explanation**: This library provides UNIX system calls like `read()`, `write()`, `close()`. "unistd" means "UNIX standard".

```c
#include <stdlib.h>
```
**Explanation**: Standard library for `exit()`.

```c
#define BUFFER_SIZE 1024
```
**Explanation**: We create a constant called `BUFFER_SIZE` with value 1024. This is the number of bytes we'll read at a time. `#define` is a preprocessor directive - it replaces `BUFFER_SIZE` with `1024` everywhere in the code before compilation.

```c
int main(int argc, char *argv[]) {
```
**Explanation**: Main function with command-line arguments.

```c
int src_fd, dst_fd;
```
**Explanation**: File descriptors are integers. `src_fd` will be the source file descriptor, `dst_fd` the destination.

```c
ssize_t n_read;
```
**Explanation**: `ssize_t` is a data type for storing the number of bytes read. It's typically an integer type.

```c
char buffer[BUFFER_SIZE];
```
**Explanation**: A character array (string) that will hold data as we read it. It's 1024 bytes large.

```c
if (argc != 3) {
```
**Explanation**: Check if correct number of arguments provided (program name + source + destination).

```c
fprintf(stderr, "Usage: %s <source> <destination>\n", argv[0]);
```
**Explanation**: Print error message to `stderr` (standard error). `stderr` is where error messages should go, separate from normal output.

```c
exit(1);
```
**Explanation**: Exit with error code 1.

```c
src_fd = open(argv[1], O_RDONLY);
```
**Explanation**: Open source file for reading.
- `O_RDONLY` = open for read-only access
- Returns a file descriptor (integer) or -1 if error

```c
if (src_fd == -1) {
```
**Explanation**: Check if file opening failed. -1 is the error code for system calls.

```c
perror("Error opening source file");
exit(1);
```
**Explanation**: Print error message and exit.

```c
dst_fd = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, 0644);
```
**Explanation**: Open/create destination file with multiple flags combined using `|` (OR operator):
- `O_WRONLY` = write only
- `O_CREAT` = if file doesn't exist, create it
- `O_TRUNC` = if file exists, truncate (erase) its contents
- `0644` = file permissions in octal (owner can read/write, others can read)

```c
if (dst_fd == -1) {
```
**Explanation**: Check if destination opening failed.

```c
perror("Error creating destination file");
close(src_fd);
exit(1);
```
**Explanation**: If destination fails, close source file first, then print error and exit.

```c
while ((n_read = read(src_fd, buffer, BUFFER_SIZE)) > 0) {
```
**Explanation**: Main copying loop:
- `read(src_fd, buffer, BUFFER_SIZE)` reads up to 1024 bytes from source into buffer
- Returns number of bytes actually read (0 = EOF, -1 = error)
- `n_read` stores this value
- Loop continues while `n_read > 0` (still reading data)

```c
if (write(dst_fd, buffer, n_read) != n_read) {
```
**Explanation**: Write data to destination:
- `write(dst_fd, buffer, n_read)` writes `n_read` bytes from buffer to destination
- It returns number of bytes actually written
- If this doesn't equal `n_read`, something went wrong

```c
perror("Error writing to destination file");
close(src_fd);
close(dst_fd);
exit(1);
```
**Explanation**: If write failed, print error, close both files, and exit.

```c
}
```
**Explanation**: End of if block.

```c
}
```
**Explanation**: End of while loop.

```c
printf("File copied successfully using system calls.\n");
```
**Explanation**: Success message.

```c
close(src_fd);
close(dst_fd);
```
**Explanation**: Close both file descriptors. Important to release resources.

```c
return 0;
}
```
**Explanation**: Return 0 for successful completion.

---

## Program 2: Fork System Call Demonstration

### Concept Explanation

**What is Fork?**
`fork()` is a system call that creates a NEW process by copying an existing process. The original process is called the "parent", and the new one is called the "child".

Think of it like cell division in biology! One cell divides into two cells that are (almost) identical copies of each other.

**After fork():**
- You now have TWO processes running
- Both continue executing from the next line after fork()
- The child gets a different process ID (PID)
- The parent gets the child's PID
- `fork()` returns 0 to the child process
- `fork()` returns the child's PID to the parent (or -1 if it failed)

**Why is this useful?**
Fork allows programs to do multiple things at once. For example, a web server can fork a new process to handle each new client connection while the parent continues accepting more connections.

**Key Concepts:**
- `pid_t`: Data type for process IDs
- `getpid()`: Returns the current process's PID
- `getppid()`: Returns the parent's PID

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf`.

```c
#include <unistd.h>
```
**Explanation**: Provides `fork()`, `getpid()`, `getppid()`.

```c
#include <sys/types.h>
```
**Explanation**: Provides `pid_t` data type.

```c
int main() {
```
**Explanation**: Main function with no command-line arguments (simple demo).

```c
pid_t pid;
```
**Explanation**: Declare a variable to store the process ID returned by fork.

```c
pid = fork();
```
**Explanation**: The fork system call! This is the key line:
- Creates a new process (child)
- Returns 0 to the child process
- Returns child's PID to the parent process
- Both processes continue from here

```c
if (pid < 0) {
```
**Explanation**: Check if fork failed. If `pid` is negative, there was an error.

```c
fprintf(stderr, "Fork failed\n");
```
**Explanation**: Print error message to stderr.

```c
return 1;
```
**Explanation**: Return 1 to indicate error.

```c
} else if (pid == 0) {
```
**Explanation**: If `pid` is 0, this is the CHILD process. The child process executes this block.

```c
printf("I am the child process. PID: %d, Parent PID: %d\n", getpid(), getppid());
```
**Explanation**: Print information about the child:
- `getpid()` returns THIS process's ID (child's PID)
- `getppid()` returns the parent's PID
- Output: "I am the child process. PID: 1234, Parent PID: 1233"

```c
} else {
```
**Explanation**: Otherwise (pid > 0), this is the PARENT process.

```c
printf("I am the parent process. PID: %d, Child PID: %d\n", getpid(), pid);
```
**Explanation**: Print information about the parent:
- `getpid()` returns this process's ID (parent's PID)
- `pid` contains the child's PID that fork returned
- Output: "I am the parent process. PID: 1233, Child PID: 1234"

```c
}
```
**Explanation**: End of if-else block.

```c
return 0;
```
**Explanation**: Return 0 for successful completion.

```c
}
```
**Explanation**: End of main function.

---

# SET-11

---

## Program 1: Shared Memory Demonstration

### Concept Explanation

**What is Shared Memory?**
Shared memory is a way for multiple processes to communicate and share data. Normally, each process has its own separate memory space - one process cannot see another's data. But with shared memory, multiple processes can access the same chunk of memory!

Think of shared memory like a shared whiteboard in a classroom:
- Multiple students can write and read from the same whiteboard
- Whatever one student writes, others can see
- It's a common space everyone can access

**Key System Calls:**
- `ftok()`: Generate a unique key for shared memory
- `shmget()`: Create or access shared memory segment
- `shmat()`: Attach the shared memory to a process's address space
- `shmdt()`: Detach the shared memory from a process
- `shmctl()`: Control shared memory (remove it)

**The Problem: ftok() requires an existing file**
The `ftok()` function needs a file that exists to generate a key. That's why this program uses `"."` (current directory) which always exists.

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf`.

```c
#include <sys/ipc.h>
```
**Explanation**: Provides `ftok()` function for generating IPC keys.

```c
#include <sys/shm.h>
```
**Explanation**: Provides shared memory functions: `shmget`, `shmat`, `shmdt`, `shmctl`.

```c
#include <string.h>
```
**Explanation**: Provides string functions like `strcpy` for copying strings.

```c
#include <unistd.h>
```
**Explanation**: Provides `fork()` for creating child process.

```c
int main() {
```
**Explanation**: Main function starts.

```c
key_t key = ftok(".", 65);
```
**Explanation**: Generate a unique key for shared memory:
- `"."` means current directory (ensures the file exists)
- `65` is a project identifier (can be any non-zero number)
- This creates a key that other processes can use to access the same shared memory

```c
int shmid = shmget(key, 1024, 0666 | IPC_CREAT);
```
**Explanation**: Get or create shared memory segment:
- `key` = the unique key from ftok
- `1024` = size in bytes (1 KB)
- `0666` = permissions (read/write for everyone)
- `IPC_CREAT` = create if it doesn't exist
- Returns a shared memory ID, or -1 on error

```c
char *str = (char*) shmat(shmid, (void*)0, 0);
```
**Explanation**: Attach shared memory to this process:
- `shmat` returns a pointer to the shared memory
- `shmid` = shared memory ID
- `(void*)0` = let system choose the address
- `0` = no special flags
- We cast it to `char*` because we're storing a string

```c
if (fork() == 0) {
```
**Explanation**: Create a child process. If return value is 0, this is the child.

```c
printf("Child: Writing to shared memory...\n");
```
**Explanation**: Child announces it's going to write.

```c
strcpy(str, "Hello from shared memory!");
```
**Explanation**: Child copies a message into the shared memory. `str` points to the shared memory, so this writes the message there.

```c
shmdt(str);
```
**Explanation**: Child detaches from shared memory (but it still exists).

```c
} else {
```
**Explanation**: This is the parent process.

```c
sleep(1);
```
**Explanation**: Parent waits for 1 second to let child write first. Important synchronization!

```c
printf("Parent: Read from shared memory: %s\n", str);
```
**Explanation**: Parent reads from shared memory. Since both processes share the same memory, parent can see what child wrote.

```c
shmdt(str);
```
**Explanation**: Parent detaches from shared memory.

```c
shmctl(shmid, IPC_RMID, NULL);
```
**Explanation**: Destroy the shared memory segment:
- `IPC_RMID` = remove the shared memory identifier
- This deletes the shared memory (only do this when done!)

```c
}
```
**Explanation**: End of if-else.

```c
return 0;
}
```
**Explanation**: Return 0.

---

## Program 2: Dining Philosophers Problem

### Concept Explanation

**What is the Dining Philosophers Problem?**
This is a classic computer science problem that demonstrates synchronization issues in concurrent programming.

**The Scenario:**
- 5 philosophers sit around a circular table
- Each philosopher alternates between thinking and eating
- There are 5 forks, one between each pair of adjacent philosophers
- To eat, a philosopher needs to pick up BOTH forks (left and right)
- After eating, they put down both forks and go back to thinking

**Why is this a problem?**
If all philosophers pick up their left fork at the same time, no one can pick up their right fork - everyone waits forever! This is called "deadlock".

**Solution with Semaphores:**
We use semaphores to control access to forks. A semaphore is like a token - a philosopher must get the token before picking up a fork.

**Key Concepts:**
- **Semaphore**: A variable used to control access to shared resources. Think of it like a club bouncer - only a certain number of people (threads) can enter (access the resource) at once.
- **sem_wait()**: Try to get the semaphore. If it's available, proceed. If not, wait.
- **sem_post()**: Release the semaphore.
- **Thread**: A thread is like a lightweight process - a path of execution within a program.

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf`.

```c
#include <pthread.h>
```
**Explanation**: POSIX threads library for creating and managing threads. `pthread_create`, `pthread_join`.

```c
#include <semaphore.h>
```
**Explanation**: Semaphore library for `sem_init`, `sem_wait`, `sem_post`, `sem_destroy`.

```c
#include <unistd.h>
```
**Explanation**: For `sleep()` function.

```c
#define N 5
```
**Explanation**: Define number of philosophers (and forks) as 5.

```c
sem_t forks[N];
```
**Explanation**: Create an array of 5 semaphores, one for each fork.

```c
void* philosopher(void* num) {
```
**Explanation**: Function that each philosopher thread runs:
- `void*` means it can accept any type of pointer (we'll pass an int)
- `num` is a pointer to the philosopher's ID number

```c
int id = *(int*)num;
```
**Explanation**: Convert the void pointer back to int pointer, then dereference to get the philosopher's ID.

```c
printf("Philosopher %d is thinking\n", id);
```
**Explanation**: Philosopher announces they're thinking.

```c
sem_wait(&forks[id]);
```
**Explanation**: Pick up left fork:
- `forks[id]` is the left fork (same index as philosopher)
- `sem_wait` tries to acquire this semaphore
- If another philosopher is using it, we wait here

```c
sem_wait(&forks[(id + 1) % N]);
```
**Explanation**: Pick up right fork:
- `(id + 1) % N` gives the right fork index (wraps around for philosopher 4)
- Philosopher 0 has forks 0 and 1
- Philosopher 4 has forks 4 and 0 (modulo wraps around)

```c
printf("Philosopher %d is eating\n", id);
```
**Explanation**: Philosopher now has both forks, they can eat.

```c
sleep(1);
```
**Explanation**: Pretend to eat for 1 second.

```c
sem_post(&forks[id]);
```
**Explanation**: Put down left fork:
- Release the semaphore so another philosopher can use this fork

```c
sem_post(&forks[(id + 1) % N]);
```
**Explanation**: Put down right fork.

```c
printf("Philosopher %d finished eating\n", id);
```
**Explanation**: Philosopher announces they're done eating.

```c
return NULL;
```
**Explanation**: End of thread function (must return something).

```c
}
```
**Explanation**: End of philosopher function.

```c
int main() {
```
**Explanation**: Main function.

```c
pthread_t threads[N];
```
**Explanation**: Create array of thread identifiers for 5 philosophers.

```c
int ids[N];
```
**Explanation**: Create array to store philosopher IDs (0 to 4).

```c
for (int i = 0; i < N; i++) sem_init(&forks[i], 0, 1);
```
**Explanation**: Initialize each fork semaphore:
- `&forks[i]` = address of the semaphore
- `0` = shared between threads of the same process
- `1` = initial value (1 means available, 0 means taken)

```c
for (int i = 0; i < N; i++) {
```
**Explanation**: Loop to create philosopher threads.

```c
ids[i] = i;
```
**Explanation**: Set philosopher's ID to current index.

```c
pthread_create(&threads[i], NULL, philosopher, &ids[i]);
```
**Explanation**: Create a new thread:
- `&threads[i]` = where to store the thread ID
- `NULL` = default thread attributes
- `philosopher` = function to run in this thread
- `&ids[i]` = argument to pass to the function (philosopher's ID)

```c
}
```
**Explanation**: End of thread creation loop.

```c
for (int i = 0; i < N; i++) pthread_join(threads[i], NULL);
```
**Explanation**: Wait for all philosophers to finish:
- `pthread_join` blocks until the specified thread completes
- We do this for all 5 threads to wait for all of them

```c
for (int i = 0; i < N; i++) sem_destroy(&forks[i]);
```
**Explanation**: Clean up: destroy all semaphores when done.

```c
return 0;
}
```
**Explanation**: Return 0 for successful completion.

---

# SET-15

---

## Program 1: Simulating the "ls" Command

### Concept Explanation

**What is the "ls" Command?**
`ls` is a command in Unix/Linux that lists all files and directories in a folder. When you type `ls` in a terminal, you see what files exist in your current folder.

**How does it work in C?**
We use the `dirent.h` library which provides functions to work with directories.

**Key Concepts:**
- **Directory**: A folder that contains files and other directories
- **DIR**: A type that represents an open directory
- **struct dirent**: A structure that holds information about a directory entry (file/directory name)
- **opendir()**: Opens a directory to start reading its contents
- **readdir()**: Reads one entry (file/directory) from the directory
- **closedir()**: Closes the directory when done

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf`.

```c
#include <dirent.h>
```
**Explanation**: Directory handling library for `DIR`, `struct dirent`, `opendir`, `readdir`, `closedir`.

```c
int main(int argc, char *argv[]) {
```
**Explanation**: Main function with command-line arguments:
- `argc` = count of arguments
- `argv[1]` = optional directory path (if user specifies one)

```c
struct dirent *de;
```
**Explanation**: Declare a pointer to `struct dirent`. This structure holds information about each entry we read from the directory. We only need the name, but struct dirent contains more info too.

```c
DIR *dr = opendir(argc > 1 ? argv[1] : ".");
```
**Explanation**: Open a directory:
- `argc > 1 ? argv[1] : "."` is a ternary operator (shorthand if-else)
- If user provided a directory path, use it
- Otherwise, use "." which means current directory
- Returns a DIR pointer, or NULL if failed

```c
if (dr == NULL) {
```
**Explanation**: Check if directory opening failed.

```c
printf("Could not open directory\n");
```
**Explanation**: Print error message.

```c
return 0;
```
**Explanation**: Exit the program.

```c
}
```
**Explanation**: End of if block.

```c
while ((de = readdir(dr)) != NULL) {
```
**Explanation**: Main loop to read directory entries:
- `readdir(dr)` reads ONE entry from the directory
- Returns a pointer to `struct dirent` containing entry info
- Returns NULL when there are no more entries (end of directory)
- Loop continues while we get valid entries

```c
printf("%s\n", de->d_name);
```
**Explanation**: Print the name of the current entry:
- `de->d_name` accesses the `d_name` field of the struct
- `d_name` contains the file/directory name as a string
- `\n` moves to a new line

```c
}
```
**Explanation**: End of while loop.

```c
closedir(dr);
```
**Explanation**: Close the directory when done. Important to release resources!

```c
return 0;
}
```
**Explanation**: Return 0 for successful completion.

---

## Program 2: Named Pipes (FIFOs)

### Concept Explanation

**What are Named Pipes?**
A named pipe (also called FIFO - "First In, First Out") is a special file that allows two processes to communicate. Unlike regular pipes (anonymous pipes), named pipes have a name in the filesystem and can be accessed by unrelated processes.

Think of it like a mailbox:
- Processes can put messages in one end
- Other processes can retrieve messages from the other end
- The pipe has a name so any process that knows the name can use it

**Real-world analogy:**
Imagine two houses that can't talk to each other directly. They both connect to a special mailbox at the post office. One house puts a letter in, the other house picks it up. The mailbox is the "named pipe" - it has an address (name) and exists independently.

**Key Concepts:**
- `mkfifo()`: Creates a named pipe file
- `O_WRONLY`: Open for writing only
- `O_RDONLY`: Open for reading only
- The writer and reader must be separate processes (we use fork() here)

### Line-by-Line Code Explanation

```c
#include <stdio.h>
```
**Explanation**: Standard I/O for `printf`.

```c
#include <string.h>
```
**Explanation**: String functions like `strcpy`.

```c
#include <fcntl.h>
```
**Explanation**: File control functions and flags like `O_WRONLY`, `O_RDONLY`.

```c
#include <sys/stat.h>
```
**Explanation**: File status functions like `mkfifo`.

```c
#include <sys/types.h>
```
**Explanation**: Data types used in system calls.

```c
#include <unistd.h>
```
**Explanation**: UNIX functions like `fork`, `read`, `write`, `close`.

```c
int main() {
```
**Explanation**: Main function.

```c
int fd;
```
**Explanation**: File descriptor for the named pipe.

```c
char *myfifo = "/tmp/myfifo";
```
**Explanation**: Define the name/path of the named pipe. `/tmp` is a standard location for temporary files.

```c
mkfifo(myfifo, 0666);
```
**Explanation**: Create the named pipe:
- `myfifo` = the pathname ("/tmp/myfifo")
- `0666` = permissions (read/write for everyone)
- Creates a special file that processes can use for communication

```c
char arr1[80], arr2[80];
```
**Explanation**: Two character arrays (strings) to hold messages:
- `arr1` will hold the message to send
- `arr2` will hold the received message

```c
if (fork() == 0) {
```
**Explanation**: Create child process. If return is 0, this is the child.

```c
fd = open(myfifo, O_WRONLY);
```
**Explanation**: Child opens the pipe for writing:
- Must open before writing
- Blocks until a reader opens the other end

```c
strcpy(arr1, "Hello through FIFO");
```
**Explanation**: Copy the message string into arr1.

```c
write(fd, arr1, strlen(arr1) + 1);
```
**Explanation**: Write the message to the pipe:
- `fd` = file descriptor
- `arr1` = string to write
- `strlen(arr1) + 1` = length of string INCLUDING the null terminator (important!)

```c
close(fd);
```
**Explanation**: Close the pipe from child's side.

```c
} else {
```
**Explanation**: This is the parent process.

```c
fd = open(myfifo, O_RDONLY);
```
**Explanation**: Parent opens the pipe for reading:
- Blocks until writer opens the other end
- This synchronization is automatic!

```c
read(fd, arr2, sizeof(arr2));
```
**Explanation**: Read the message from the pipe:
- `fd` = file descriptor
- `arr2` = where to store received message
- `sizeof(arr2)` = maximum bytes to read

```c
printf("Parent received: %s\n", arr2);
```
**Explanation**: Print the received message.

```c
close(fd);
```
**Explanation**: Close the pipe.

```c
unlink(myfifo);
```
**Explanation**: Remove the named pipe file from the filesystem. Since we're done communicating, we clean up.

```c
}
```
**Explanation**: End of if-else.

```c
return 0;
}
```
**Explanation**: Return 0 for successful completion.

---

# Summary of All Concepts Covered

## File Operations
- **fopen/fclose**: Standard library file operations (high-level)
- **open/close**: System calls for file operations (low-level)
- **File descriptors**: Integer handles for open files
- **Buffers**: Temporary storage for reading/writing data in chunks

## Process Management
- **fork()**: Create a new process by duplicating the existing one
- **Parent and Child processes**: The original and its copy
- **Process IDs (PID, PPID)**: Unique identifiers for processes

## CPU Scheduling
- **Process**: A running program
- **Burst Time**: Time a process needs on CPU
- **Waiting Time**: Time a process waits in queue
- **Turnaround Time**: Total time from arrival to completion
- **FCFS**: First Come First Serve scheduling algorithm

## Inter-Process Communication (IPC)
- **Shared Memory**: Multiple processes share the same memory segment
- **ftok()**: Generate keys for IPC
- **shmget/shmat/shmdt/shmctl**: Shared memory operations

## Synchronization
- **Semaphores**: Token-based synchronization mechanism
- **sem_wait()**: Acquire semaphore (wait/decrement)
- **sem_post()**: Release semaphore (signal/increment)
- **Threads**: Lightweight execution paths within a process
- **pthread_create/pthread_join**: Thread management

## Directory Operations
- **DIR and dirent**: Directory stream and directory entries
- **opendir/readdir/closedir**: Directory navigation functions

## Named Pipes (FIFOs)
- **mkfifo()**: Create a named pipe
- **FIFO**: First In First Out communication channel
- **unlink()**: Remove a file from filesystem

---

*This explanation file covers all programs from SET-3, SET-7, SET-11, and SET-15 as specified in Programs.md*