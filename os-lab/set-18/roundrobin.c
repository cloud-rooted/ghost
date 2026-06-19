// roundrobin.c
// Compile: cc roundrobin.c
// Run:     ./a.out

#include <stdio.h>

int main()
{
    int n, ts, BT[20], wt[20], TAT[20], RT[20];
    int twt = 0, ttat = 0, i, t = 0, count = 0;
    float avgwt, avgTAT;

    printf("Enter the number of processes: ");
    scanf("%d", &n);

    printf("Enter the time quantum (time slice): ");
    scanf("%d", &ts);

    for (i = 1; i <= n; i++)
    {
        printf("Enter burst time of process P%d: ", i);
        scanf("%d", &BT[i]);
        RT[i] = BT[i];      // Remaining time = burst time initially
    }

    // Simulate Round Robin
    while (count != n)
    {
        for (i = 1; i <= n; i++)
        {
            if (RT[i] > 0)
            {
                if (RT[i] > ts)
                {
                    RT[i] -= ts;
                    t += ts;
                }
                else
                {
                    t += RT[i];
                    RT[i] = 0;
                    TAT[i] = t;
                    count++;
                }
            }
        }
        if (count == n)
            break;
    }

    // Compute waiting time and averages
    for (i = 1; i <= n; i++)
    {
        wt[i]  = TAT[i] - BT[i];
        twt   += wt[i];
        ttat  += TAT[i];
    }

    avgwt  = (float)twt  / n;
    avgTAT = (float)ttat / n;

    printf("\nProcess  BurstTime  WaitingTime  TurnAroundTime\n");
    for (i = 1; i <= n; i++)
        printf("P%d\t%d\t%d\t%d\n", i, BT[i], wt[i], TAT[i]);

    printf("\nAverage Waiting Time     = %.2f\n", avgwt);
    printf("Average Turn Around Time = %.2f\n", avgTAT);

    return 0;
}
