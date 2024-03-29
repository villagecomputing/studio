'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
  spec: object;
};

function ReactSwagger({ spec }: Props) {
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}

export default ReactSwagger;
