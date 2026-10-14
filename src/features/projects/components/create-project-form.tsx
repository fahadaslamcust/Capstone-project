'use client';

export function CreateProjectForm({
  formAction,
  isPending,
  state,
}: {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  state: any;
}) {
  return (
    <form
      action={formAction}
      className="flex gap-4 items-start bg-white p-4 rounded shadow"
    >
      <div className="flex flex-col gap-1">
        <input
          name="name"
          required
          placeholder="Project Name"
          className="border p-2 rounded"
        />

        {state?.fieldErrors?.name && (
          <span className="text-red-500 text-sm">
            {state.fieldErrors.name}
          </span>
        )}
      </div>

      <input
        name="description"
        placeholder="Description"
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? 'Saving...' : 'Add Project'}
      </button>
    </form>
  );
}