import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'Σύλλογος Φίλων Στήριξης Κέντρου Υγείας Τροπαίων';
const DEFAULT_DESCRIPTION = 'Ενημερώσεις, ανακοινώσεις, έγγραφα και υπηρεσίες για τους κατοίκους της Δυτικής Γορτυνίας.';
const SITE_URL = 'https://www.elpidazwhs.gr';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="el_GR" />
      <meta property="og:site_name" content={DEFAULT_TITLE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}