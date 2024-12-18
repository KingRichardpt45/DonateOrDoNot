import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./profile.module.css";
import {File as ModelFile} from "@/models/File";

interface ItemProps {
  items: any[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

const ItemsSection: React.FC<ItemProps> = ({
  items,
  currentPage,
  itemsPerPage,
  totalPages,
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.LastBought}>
      <h2>Last Bought</h2>
      <div className={styles.ItemsGrid}>
        {currentItems && currentItems.length > 0 ? (
          currentItems.map((item, index) => {
            const imagePathItem = `/documents/${item.image_id}_${
              (item.image.value as ModelFile).original_name
            }`;

            return (
              <div key={index} className={styles.BadgeItem}>
                <Image
                  src={imagePathItem}
                  alt={item.name || "Item"}
                  className={styles.BadgeImage}
                  width={50}
                  height={50}
                />
                <p>{item.name}</p>
                <p>{item.cost}</p>
              </div>
            );
          })
        ) : (
          <p>No items bought yet</p>
        )}
      </div>

      {/* Paginação */}
      <div className={styles.Pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <Link
            key={i}
            href={`?itemsPage=${i + 1}`}
            className={currentPage === i + 1 ? styles.Active : ""}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemsSection;
