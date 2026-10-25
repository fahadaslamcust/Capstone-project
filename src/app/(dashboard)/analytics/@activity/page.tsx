import { getCurrentUser } from "@/lib/dal/auth";
import { getRecentActivityFromD1 } from "@/lib/d1-worker";

const ACTION_LABELS: Record<string, string> = {
    PROJECT_CREATED: "created",
    PROJECT_UPDATED: "updated",
    PROJECT_ARCHIVED: "archived",
};

export default async function ActivityPage() {
    const user = await getCurrentUser();

    if (!user) return null;

    const { rows } = await getRecentActivityFromD1(user.organization_id);

    return (
        <div className="rounded border p-4">
            <h2 className="mb-3 font-semibold">Recent activity</h2>

            {rows.length === 0 ? (
                <p className="text-sm text-gray-500">No activity yet.</p>
            ) : (
                <ul className="space-y-3">
                    {rows.map((r) => (
                        <li key={r.id} className="text-sm">
                            <p>
                                <span className="font-medium">{r.userName}</span>{" "}
                                {ACTION_LABELS[r.action] ?? r.action} project{" "}
                                <span className="font-medium">
                                    “{r.projectName ?? "deleted project"}”
                                </span>
                            </p>

                            <p className="text-xs text-gray-500">
                                {new Date(r.createdAt * 1000).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}