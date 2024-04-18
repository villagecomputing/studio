import swaggerSpec from './../../../public/swagger.json';
import ReactSwagger from './ReactSwagger';

export default async function IndexPage() {
  return (
    <section className="container">
      <ReactSwagger spec={swaggerSpec} />
    </section>
  );
}
