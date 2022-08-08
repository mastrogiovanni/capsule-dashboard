import * as k8s from "@kubernetes/client-node";

async function main() {

    const kc = new k8s.KubeConfig();

    if (process.env.IN_CLUSTER) {
        kc.loadFromCluster();
    }
    else {
        kc.loadFromDefault();
    }

    const k8sApiMC = kc.makeApiClient(k8s.ApiextensionsV1Api);
    // const k8sApiMC = kc.makeApiClient(k8s.CustomObjectsApi);

    const result = await k8sApiMC.listCustomResourceDefinition()

    console.log(result?.body['items'].filter(item => item.spec.group === 'kyverno.io').map(item => item.metadata?.name));

}

main().catch(console.log)
