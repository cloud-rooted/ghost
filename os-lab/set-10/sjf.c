// sjf.c
// Compile: cc sjf.c
// Run:     ./a.out

#include <stdio.h>

int main()
{
    int n, bt[20], wt[20], tut[20], twt = 0, ttt = 0, t = 0;

    printf("Enter no. of processes: ");
    scanf("%d", &n);

    printf("Enter burst times: ");
    for (int i = 0; i < n; i++)
        scanf("%d", &bt[i]);

    // Sort processes by burst time (selection sort — SJF non-preemptive)
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (bt[j] < bt[i])
            {
                t = bt[i];
                bt[i] = bt[j];
                bt[j] = t;
            }

    // Calculate waiting time
    wt[0] = 0;
    for (int i = 1; i < n; i++)
    {
        wt[i] = bt[i - 1] + wt[i - 1];
        twt += wt[i];
    }

    // Calculate turnaround time
    printf("\nProcess  BurstTime  WaitingTime  TurnAroundTime\n");
    for (int i = 0; i < n; i++)
    {
        tut[i] = wt[i] + bt[i];
        ttt += tut[i];
        printf("P%d\t%d\t%d\t%d\n", i + 1, bt[i], wt[i], tut[i]);
    }

    printf("\nAverage Waiting Time     = %.2f\n", (float)twt / n);
    printf("Average Turn Around Time = %.2f\n", (float)ttt / n);

    return 0;
}
