import inventory_data_json from './inventory_data_with_categories (1).json';

export async function add_items(items?: { manufacturer: string, description: string, specifications: string, purchaseDate: string, purchasePrice: number, expectedLifetime: number, category: string}[], ) {

    const response = await fetch(`http://10.0.0.105:4000/api/v1/inventory/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ inventory_data: items || inventory_data_json})
    });

    return await response.json();
}

export async function remove_items(item_ids: number[]) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/inventory/remove`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ item_ids })
    });

    return await response.json();
}

export async function get_items() {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/inventory/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function get_loaned_items() {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/inventory/getloaned`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function loan_items(item_ids: number[], loaned_to: string) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/inventory/loan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ item_ids, loaned_to })
    });

    return await response.json();
}

export async function return_items(item_ids: number[]) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/inventory/return`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ item_ids })
    });

    return await response.json();
}
