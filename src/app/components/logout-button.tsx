import { logoutAction } from "@/actions/auth";

export function LogoutButton() {
	return (
		<form action={logoutAction}>
			<button
				type="submit"
				className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
			>
				Log out
			</button>
		</form>
	);
}
