export const ERROR_MESSAGE_GENERIC = 'Something went wrong. Please try again later.';

export const COUNTRIES = [
    "United States",
    "Canada",
    "Australia",
    "Germany",
    "Bangladesh",
    "China",
    "Argentina",
    "India",
    "Afghanistan",
    "France",
    "Brazil",
    "Belgium",
    "Colombia",
    "Albania"
];

export const STATES = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa"
]

export function formatCustomerSince(createdAt?: string) {
    if (!createdAt) return "—";
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}