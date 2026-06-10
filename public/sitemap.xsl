<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Strada Reports — Site Haritası</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
            background: #f8fafc;
            color: #0f172a;
            line-height: 1.5;
            padding: 2rem 1rem;
          }
          .wrap { max-width: 1100px; margin: 0 auto; }
          h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
          .meta { color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem; }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
          }
          thead { background: #0f172a; color: #f8fafc; }
          th, td {
            text-align: left;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
            font-size: 0.875rem;
          }
          th { font-weight: 600; white-space: nowrap; }
          tbody tr:hover { background: #f1f5f9; }
          tbody tr:last-child td { border-bottom: none; }
          a { color: #2563eb; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .langs { display: flex; flex-wrap: wrap; gap: 0.35rem; }
          .lang {
            display: inline-block;
            padding: 0.15rem 0.45rem;
            border-radius: 999px;
            background: #eff6ff;
            color: #1d4ed8;
            font-size: 0.75rem;
            font-weight: 500;
          }
          .num { color: #64748b; font-variant-numeric: tabular-nums; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Strada Reports — Site Haritası</h1>
          <p class="meta">
            <xsl:value-of select="count(s:urlset/s:url)" /> URL ·
            <a href="https://strada.tr">strada.tr</a>
          </p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Son Güncelleme</th>
                <th>Sıklık</th>
                <th>Öncelik</th>
                <th>Diller</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <xsl:sort select="s:loc" />
                <tr>
                  <td class="num"><xsl:value-of select="position()" /></td>
                  <td>
                    <a href="{s:loc}"><xsl:value-of select="s:loc" /></a>
                  </td>
                  <td class="num"><xsl:value-of select="substring(s:lastmod, 1, 10)" /></td>
                  <td><xsl:value-of select="s:changefreq" /></td>
                  <td class="num"><xsl:value-of select="s:priority" /></td>
                  <td>
                    <div class="langs">
                      <xsl:for-each select="xhtml:link">
                        <span class="lang">
                          <xsl:value-of select="@hreflang" />
                        </span>
                      </xsl:for-each>
                    </div>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
