
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import styles from './styles.module.css';

interface CardProps {
  title: string;
  children: ReactNode;
  icon: ReactNode;
  link: string;
}

const Card = ({ title, children, icon, link }: CardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.content}>{children}</p>
      <Link to={link} className={styles.button}>
        <Button variant="outline" onClick={() => {}}>
          למעבר
        </Button>
      </Link>
    </div>
  );
};

export default Card;
