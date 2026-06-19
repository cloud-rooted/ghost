#include <stdio.h>

struct Process {
    int pid;
    int bt; // Burst Time
    int wt; // Waiting Time
    int tat; // Turnaround Time
};

void calculateTimes(struct Process p[], int n) {
    p[0].wt = 0;
    p[0].tat = p[0].bt;

    for (int i = 1; i < n; i++) {
        p[i].wt = p[i-1].wt + p[i-1].bt;
        p[i].tat = p[i].wt + p[i].bt;
    }
}

int main() {
    int n;
    printf("Enter number of processes: ");
    scanf("%d", &n);

    struct Process p[n];
    for (int i = 0; i < n; i++) {
        p[i].pid = i + 1;
        printf("Enter burst time for P%d: ", p[i].pid);
        scanf("%d", &p[i].bt);
    }

    calculateTimes(p, n);

    float avg_wt = 0, avg_tat = 0;
    printf("\nPID\tBT\tWT\tTAT\n");
    for (int i = 0; i < n; i++) {
        avg_wt += p[i].wt;
        avg_tat += p[i].tat;
        printf("%d\t%d\t%d\t%d\n", p[i].pid, p[i].bt, p[i].wt, p[i].tat);
    }

    printf("\nAverage Waiting Time: %.2f", avg_wt / n);
    printf("\nAverage Turnaround Time: %.2f\n", avg_tat / n);

    return 0;
}
