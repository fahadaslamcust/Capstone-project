import Form from 'next/form';

export function SearchBar() {
  return (
    <Form action="/projects" className="flex gap-4 mb-8">
      <input 
        name="q" 
        placeholder="Search projects..." 
        className="border p-2 rounded flex-1"
      />
      <select name="status" className="border p-2 rounded">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
      <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
        Search
      </button>
    </Form>
  );
}