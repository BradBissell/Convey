import { Container, createStyles, Text, Title } from '@mantine/core';
import { useState } from 'react';
import KeywordSearch from '../components/KeywordSearch';
import Portraits from '../components/Portraits';

const useStyles = createStyles((theme) => ({
  section: {
    backgroundColor: theme.white,
    padding: '1rem 0',
    background: theme.colors.gray[0],
    boxShadow: '0px 0px 1px black',
    marginBottom: '1rem',
  },
}));

// Rendered as a fully static page (no getStaticProps). Portraits fetches the
// initial results client-side via SWR. Previously this used getStaticProps to
// seed an SWR fallback, but that produced an SSG "prerender variant" that Vercel
// served as a raw multipart/RSC body for `/` only. Keeping the page static
// (like /about) avoids that, and removes a build-time DynamoDB dependency.
export default function Home() {
  const { classes } = useStyles();
  const [keyword, setKeyword] = useState('college');

  return (
    <>
      <section className={classes.section}>
        <Container>
          <Title align="center" order={2} p="md">
            Search by Keyword
          </Title>
          <Text align="center" fs="italic" color="dimmed">
            Discover compelling human interest stories to illustrate your idea
          </Text>
          <KeywordSearch keyword={keyword} setKeyword={setKeyword} />
        </Container>
      </section>
      <Portraits keyword={keyword} />
    </>
  );
}
