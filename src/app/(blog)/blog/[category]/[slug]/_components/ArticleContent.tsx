import styles from "../../[slug]/_styles/page.module.css";

const ArticleContent = ({ html }: { html: string }) => (
  <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
);

export default ArticleContent;
