# 👻 ghost/academics

> **rapid study sessions. zero fluff. straight to the code.**

```
  curl -sL https://worker.com/3  | bash   # spawn set-3 in 1s
  curl -sL https://worker.com/7  | bash   # spawn set-7 in 1s
  curl -sL https://worker.com/11 | bash   # spawn set-11 in 1s
  curl -sL https://worker.com/15 | bash   # spawn set-15 in 1s
```
current status Down: not deployed 
No LMS. No PDFs. Just C code, on your machine, instantly.

---

## what's inside

| set | programs | compile |
|-----|----------|---------|
| set-1 | orphan, producer-consumer | `cc orphan.c` |
| set-3 | file-copy (stdio), fcfs | `cc file_copy.c` |
| set-6 | lseek, lru | `cc lseekdemo.c` |
| set-7 | file-copy (syscalls), fork demo | `cc file_copy.c` |
| set-10 | echo-pipe, sjf | `cc echo_pipe.c` |
| set-11 | shared memory, dining philosophers | `cc shm_demo.c` |
| set-14 | thread params, sstf disk | `cc threadparam.c -lpthread` |
| set-15 | ls simulator, named pipes | `cc ls_sim.c` |
| set-18 | round-robin, named pipes (2-prog) | `cc roundrobin.c` |

Each set has a matching line-by-line `Explanation.md` so you actually understand what you just compiled.

---

## quick start

```bash
# pick a set, any set
cd set-1 && cc orphan.c && ./a.out
cd set-6 && cc lseekdemo.c && ./a.out
cd set-14 && cc threadparam.c -lpthread && ./a.out
```

Want the explanation too?
```
less Explanation.md
```

---

## vibe

- no makefiles. no cmake. no containers.
- raw C. gcc. a.out. terminal.
- study like it's `fork()` — spawn a session, finish it, move on.

---

## worker

The Cloudflare Worker (`worker.js`) serves every set as a self-extracting bash script.

```bash
curl -sL https://your-worker.workers.dev/3 | bash
# → set-3/ lands in your cwd with file_copy.c and fcfs.c
```

No login. No API key. Just `curl | bash`.

---

## structure

```
.
├── set-*/           # source code, compiled binaries
├── os-lab/          # organized lab programs (set-1,6,10,14,18)
├── Explanation.md   # concept + line-by-line walkthrough
├── Programs.md      # master program list
├── worker.js        # cloudflare worker endpoint
└── README.md        # you are here
```

---

**ghost the curriculum. compile from anywhere.**
