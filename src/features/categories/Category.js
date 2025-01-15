import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from './categoriesApiSlice';
import { memo } from 'react';
import Button from 'react-bootstrap/Table'; 

const Category = ({ categoryId }) => {
    const { category } = useGetCategoriesQuery('categoriesList', {
      selectFromResult: ({ data }) => ({
        category: data?.entities[categoryId]
      }),
    });
    const navigate = useNavigate();
  
    if (!category) return null;
  
    const created = new Date(category.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' });
    const updated = new Date(category.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' });
  
    const handleEdit = () => navigate(`/dash/categories/${categoryId}`);
  
    return (
      <tr className="align-middle">
        <td className="py-3">{created}</td>
        <td className="py-3">{updated}</td>
        <td className="py-3">{category.category_id}</td>
        <td className="py-3">{category.category_name}</td>
        <td className="py-3 text-center" style={{ position: 'relative', zIndex: 3 }}>
          <Button
            variant="light"
            size="sm"
            onClick={handleEdit}
            className="rounded-circle p-2"
            title="Edit category"
            style={{ position: 'relative', zIndex: 4 }}
          >
            <FontAwesomeIcon 
              icon={faPenToSquare} 
              className="text-primary"
            />
          </Button>
        </td>
      </tr>
    );
  };
  

export default Category 