export interface Tenant {
    name: string;
    owners: string[];
}

export async function getTenants() {
    const result = await fetch('/tenants');
    const body = await result.json();
    if (body.success) {
        return body.data.tenants;
    }     
}

export async function createTenant(name: string, owners: string[]) {
    return await fetch('/tenants', {
        method: "POST",
        body: JSON.stringify({
            name: name,
            owners: owners
        })
    });   
}

export async function deleteTenant(name: string) {
    return await fetch('/tenants', {
        method: "DELETE",
        body: JSON.stringify({
            name: name
        })
    });   
}