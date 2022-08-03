import * as k8s from "@kubernetes/client-node";

async function main() {

    const kc = new k8s.KubeConfig();

    if (process.env.IN_CLUSTER) {
        kc.loadFromCluster();
    }
    else {
        kc.loadFromDefault();
    }

    const k8sApiMC = kc.makeApiClient(k8s.CustomObjectsApi);

    const result = await k8sApiMC.listClusterCustomObject(
        "capsule.clastix.io",
        "v1beta1",
        "tenants"
    );

    console.log((result?.body as any)?.items);

}

main().catch(console.log)
