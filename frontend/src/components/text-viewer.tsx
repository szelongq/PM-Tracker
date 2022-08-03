import { TextProps, Text, createStyles } from "@mantine/core";
import Linkify from "linkify-react";
import { MouseEvent, ReactNode } from "react";

const useStyles = createStyles((theme) => ({
  preserveWhiteSpace: {
    whiteSpace: "break-spaces",
  },
  overflowWrap: {
    overflowWrap: "anywhere",
  },
  link: {
    a: {
      ...theme.fn.focusStyles(),
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
      textDecoration: "none",

      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
}));

type LinkType = "email" | "url"; // manual typing, can add more as more types are discovered

const LINKIFY_OPTIONS = {
  attributes: {
    onClick: (event: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      // prevents click from propagating to parent element
      event.stopPropagation();
    },
  },
  target: (_: string, linkType: LinkType) =>
    linkType === "url" ? "_blank" : null,
  rel: (_: string, linkType: LinkType) =>
    linkType === "url" ? "noreferrer" : null,
};

type Props<T> = TextProps<T> & {
  withLinkify?: boolean;
  preserveWhiteSpace?: boolean;
  overflowWrap?: boolean;
  children: ReactNode;
};

function TextViewer<T = "div">({
  withLinkify,
  preserveWhiteSpace,
  overflowWrap,
  children,
  className,
  ...props
}: Props<T>) {
  const { classes, cx } = useStyles();

  const textComponent = (
    <Text
      className={cx(
        classes.link,
        preserveWhiteSpace && classes.preserveWhiteSpace,
        overflowWrap && classes.overflowWrap,
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );

  return withLinkify ? (
    <Linkify options={LINKIFY_OPTIONS}>{textComponent}</Linkify>
  ) : (
    textComponent
  );
}

export default TextViewer;
