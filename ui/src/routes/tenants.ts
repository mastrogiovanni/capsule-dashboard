import * as k8s from "@kubernetes/client-node";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {

  const kc = new k8s.KubeConfig();

  if (process.env.IN_CLUSTER) {
    console.log("I'm using k8s in cluster")
    kc.loadFromCluster();
  }
  else {
    console.log("I'm using k8s on dev mode")
    kc.loadFromDefault();
  }

  const k8sApiMC = kc.makeApiClient(k8s.CustomObjectsApi);

  let items = [];

  try {
    const result = await k8sApiMC.listClusterCustomObject(
      "capsule.clastix.io",
      "v1beta1",
      "tenants"
    );
  
    items = (result?.body as any)?.items;
  }
  catch (e) {
    console.log(e)
  }

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