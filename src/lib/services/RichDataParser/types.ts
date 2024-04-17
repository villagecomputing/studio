export type ComponentProps<T extends object> = T & {
  src: string;
};

export type MimeTypeToComponent = {
  [mimeType: string]: <T extends object>(
    props: ComponentProps<T>,
  ) => JSX.Element;
};
