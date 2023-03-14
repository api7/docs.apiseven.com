import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { isRegexpStringMatch } from '@docusaurus/theme-common';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type { Props } from '@theme/NavbarItem/NavbarNavLink';

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex = '/',
  to,
  href,
  label,
  html,
  isDropdownLink,
  prependBaseUrlToHref,
  ...props
}: Props): JSX.Element {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const isExternalLink = label && href && !isInternalUrl(href);
  const ProjectName = {
    cloud: 'Cloud',
    enterprise: 'Enterprise',
    apisix: 'Apache APISIX'
  };

  // Link content is set through html XOR label
  const linkContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : {
      children: (
        <>
          {label}
          {isExternalLink && (
            <IconExternalLink
              {...(isDropdownLink && { width: 12, height: 12 })}
            />
          )}
        </>
      ),
    };

  if (href) {
    return (
      <Link
        href={prependBaseUrlToHref ? normalizedHref : href}
        {...props}
        {...linkContentProps}
      />
    );
  }

  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) => {
          const slug = location.pathname.split('/')[1];
          const activeLabelRegex = `/${slug}/*`;
          return (
            isRegexpStringMatch(activeLabelRegex, location.pathname) && label === ProjectName[slug]
          )
        }
      })}
      {...props}
      {...linkContentProps}
    />
  );
}
