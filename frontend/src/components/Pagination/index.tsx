import React from 'react';
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <UIPagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 && (
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)} 
              className="hover:border border-transparent hover:border-primary-5" // Adicionando estilo de hover
            />
          )}
        </PaginationItem>
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                onClick={() => handlePageChange(page)} 
                isActive={currentPage === page}
                className={currentPage === page ? 'border border-primary-5' : ''}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {totalPages > 5 && currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          {currentPage < totalPages && (
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)} 
              className="hover:border border-transparent hover:border-primary-5" // Adicionando estilo de hover
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
};

export default Pagination;
