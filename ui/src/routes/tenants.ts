import * as k8s from "@kubernetes/client-node";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {

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

  const items = (result?.body as any)?.items;

  return {
    status: 200,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: {
      tenants: items,
      number: Math.random()
    }
  };
}