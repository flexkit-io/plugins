**Run notification and Slack, #flexkit-alerts**

> **Low-stock alert failed at 09:30: Slack connection expired (Connection).**
>
> The alert found 3 newly low products but could not stage its message: Slack answered "token_revoked" when the run tried to post. The last successful run was at 09:00, and the Slack plugin was disconnected at 09:12.
>
> **Suggested fix:** reconnect Slack in AI → Plugins (a workspace admin may need to approve the app again), then start the low-stock alert once with "Test run".
>
> It will not recover on its own: every run will fail until Slack is reconnected.

---

**10:00, 10:30, 11:00: same failure, no new message**

Memory updated: *Low-stock alert, Connection (Slack), reported 09:31, failed 3 more times since.*
