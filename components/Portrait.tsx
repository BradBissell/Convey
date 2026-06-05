import {
  BackgroundImage,
  Box,
  Center,
  createStyles,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { IllustrationMeta } from '../types/types';
import { portraitSrc } from '../lib/imageUrl';

const IMG_SIZE = 250;

const useStyles = createStyles((theme) => ({
  background: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    '&:hover > div': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      '.mantine-Text-root': {
        display: 'block',
        color: theme.white,
      },
    },
  },
  text: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    '& .mantine-Text-root': {
      display: 'none',
    },
  },
}));

interface PortraitProps {
  meta: IllustrationMeta;
}

export default function Portrait({ meta }: PortraitProps) {
  const { classes } = useStyles();

  // PK is `Illustration#<snippet>` (13-char prefix); SK is `Meta#<sourceUrl>`,
  // and meta.link is that same source url. The /story VDP looks the record up by
  // these two values. Next's Link query object handles URL-encoding.
  const snippetKey = meta.PK.slice(13);
  const snippet = snippetKey + '...';
  return (
    <Box sx={{ width: IMG_SIZE }}>
      <Link
        href={{
          pathname: '/story',
          query: { snippet: snippetKey, source: meta.link },
        }}
        style={{ textDecoration: 'none' }}
      >
        <BackgroundImage
          src={portraitSrc(meta.image)}
          className={classes.background}
        >
          <Box sx={{ width: IMG_SIZE, height: IMG_SIZE }}>
            <Center p="md" className={classes.text}>
              <Text>{snippet}</Text>
            </Center>
          </Box>
        </BackgroundImage>
      </Link>
    </Box>
  );
}
