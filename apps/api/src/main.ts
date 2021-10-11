import { bootstrap } from './app';
import { environment } from './environments/environment';

const port = process.env.PORT ? Number(process.env.PORT) : environment.port;

async function startLocal() {
  const fastifyInstance = await bootstrap();
  await fastifyInstance.listen(port, '0.0.0.0');
}

startLocal().catch(console.error.bind(console));
