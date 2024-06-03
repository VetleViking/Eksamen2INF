import { json } from "stream/consumers";
import inventory_data from "../inventory_data_with_categories.json";

export async function upload_items() {
    // add id and loanedBy to each item
    let inventory_data_w_all = inventory_data.map((item, index) => {
        return {
            ...item,
            id: index,
            loanedBy: null
        };
    });
    const response = await fetch(`http://localhost:4000/api/v1/inventory/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inventory_data: inventory_data_w_all })
    });

    return await response.json();
}

export async function get_items() {
    const response = await fetch(`http://localhost:4000/api/v1/inventory/get`, {
        method: 'GET'
    });

    return await response.json();
}

export async function loan_items(item_ids: number[], loaned_to: string) {
    const response = await fetch(`http://localhost:4000/api/v1/inventory/loan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_ids, loaned_to })
    });

    return await response.json();
}

export async function create_user(username: string, password: string) {
    const response = await fetch(`http://localhost:4000/api/v1/users/createuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function login(username: string, password: string) {
    const response = await fetch(`http://localhost:4000/api/v1/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function decode_jwt(token: string) {
    const response = await fetch(`http://localhost:4000/api/v1/users/decodejwt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ token })
    });

    return await response.json();
}