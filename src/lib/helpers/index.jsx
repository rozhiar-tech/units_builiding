export function getOrderStatus(status) {
    switch (status) {
        case 'Payed':
            return (
                <span className="capitalize py-1 px-2 rounded-md text-xs text-green-500 bg-sky-100">
                    {status.replaceAll('_', ' ').toLowerCase()}
                </span>
            )
        case 'Payment Plan':
            return (
                <span className="capitalize py-1 px-2 rounded-md text-xs text-red-600 bg-orange-100">
                    {status.replaceAll('_', ' ').toLowerCase()}
                </span>
            )

        default:
            return (
                <span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
                    {status.replaceAll('_', ' ').toLowerCase()}
                </span>
            )
    }
}
