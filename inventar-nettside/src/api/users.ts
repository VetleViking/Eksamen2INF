export async function get_users() {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/users/getall`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function make_admin(username: string) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/users/makeadmin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ username })
    });

    return await response.json();
}

export async function remove_admin(username: string) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/users/removeadmin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ username })
    });

    return await response.json();
}

export async function create_user(username: string, password: string, email: string) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/users/createuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    });

    return await response.json();
}

export async function delete_user(username: string) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/users/deleteuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ username })
    });

    return await response.json();
}

export async function login(username: string, password: string) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function reset_password(token: string, password: string) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/users/resetpassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
    });

    return await response.json();
}

export async function decode_jwt(token: string) {
    const response = await fetch(`http://10.0.0.105:4000/api/v1/users/decodejwt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ token })
    });

    return await response.json();
}