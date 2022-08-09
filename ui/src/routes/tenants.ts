import * as k8s from "@kubernetes/client-node";

const CORS_DOMAIN = "*"

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

function success(data: any) {
  return {
    status: 200,
    headers: {
      'access-control-allow-origin': CORS_DOMAIN
    },
    body: {
      success: true,
      data
    }
  }
}

function error(message: string) {
  return {
    status: 200,
    headers: {
      'access-control-allow-origin': CORS_DOMAIN
    },
    body: {
      success: false,
      message
    }
  }
}

/** @type {import (@sveltejs/kit).RequestHandler} */
export async function GET() {
  try {
    const result = await k8sApiMC.listClusterCustomObject(
      "capsule.clastix.io",
      "v1beta1",
      "tenants"
    );

    let tenants = (result?.body as any)?.items;

    return success({
      tenants
    })
  }
  catch (e) {
    return error("" + e)
  }
}

/** @type {import (@sveltejs/kit).RequestHandler} */
export async function POST({ request }) {
  try {
    const form = await request.json()

    const { action, name, owners } = form
  
    console.log(action, name, owners)
  
    const payload = {
      "apiVersion": "capsule.clastix.io/v1beta1",
      "kind": "Tenant",
      "metadata": {
        "name": name
      },
      "spec": {
        "owners": owners.map(owner => {
          return {
            name: owner,
            kind: "User"
          }
        })
      }
    }

    await k8sApiMC.createClusterCustomObject("capsule.clastix.io", "v1beta1", "tenants", payload)
 
    return success({})
      
  }
  catch (e) {
    return error("" + e)
  }
}

/** @type {import (@sveltejs/kit).RequestHandler} */
export async function DELETE({ request }) {
  try {
    const form = await request.json()
    const { name } = form
    await k8sApiMC.deleteClusterCustomObject("capsule.clastix.io", "v1beta1", "tenants", name)
  }
  catch (e) {
    return error("" + e)
  }
}
