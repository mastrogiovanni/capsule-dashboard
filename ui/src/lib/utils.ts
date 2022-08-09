export function parseOwners(tenant: any) {
    return tenant.spec.owners.map((item: any) => `${item.name} (${item.kind})`).join(', ');
}
