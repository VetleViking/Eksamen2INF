export async function send_reset_email(email: string) {
    const response = await fetch(`http://localhost:4000/api/v1/users/resetpasswordemail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    return await response.json();
}

export async function decode_reset_password_token(token: string) {
    const response = await fetch(`http://localhost:4000/api/v1/users/decoderesetpasswordtoken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });

    return await response.json();
}
