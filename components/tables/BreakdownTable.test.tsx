import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BreakdownTable } from './BreakdownTable';
import type { RevenueBreakdownRow, ExpenseBreakdownRow } from '@/types/breakdowns';
import {
  mockRevenueBreakdownByCustomer,
  mockRevenueBreakdownByProduct,
  mockRevenueBreakdownByCategory,
} from '@/__tests__/fixtures/breakdowns';

describe('BreakdownTable', () => {
  describe('given revenue breakdown rows grouped by customer', () => {
    it('renders a table with data-testid="breakdown-table"', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCustomer}
          groupBy="customer"
        />
      );

      expect(screen.getByTestId('breakdown-table')).toBeInTheDocument();
    });

    it('renders a row for each data item', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCustomer}
          groupBy="customer"
        />
      );

      const rows = screen.getAllByTestId('breakdown-table-row');
      expect(rows).toHaveLength(3);
    });

    it('displays customer names in the table', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCustomer}
          groupBy="customer"
        />
      );

      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
      expect(screen.getByText('Beta Inc')).toBeInTheDocument();
      expect(screen.getByText('Gamma LLC')).toBeInTheDocument();
    });

    it('displays revenue amounts formatted as currency', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCustomer}
          groupBy="customer"
        />
      );

      // $45,000 formatted
      expect(screen.getByText('$45,000')).toBeInTheDocument();
    });

    it('displays invoice counts', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCustomer}
          groupBy="customer"
        />
      );

      // First row has 9 invoices
      expect(screen.getByText('9')).toBeInTheDocument();
    });
  });

  describe('given revenue breakdown rows grouped by product', () => {
    it('displays product names in the table', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByProduct}
          groupBy="product"
        />
      );

      expect(screen.getByText('Widget Pro')).toBeInTheDocument();
      expect(screen.getByText('Widget Lite')).toBeInTheDocument();
    });
  });

  describe('given revenue breakdown rows grouped by category', () => {
    it('displays category names in the table', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCategory}
          groupBy="category"
        />
      );

      expect(screen.getByText('Software')).toBeInTheDocument();
      expect(screen.getByText('Hardware')).toBeInTheDocument();
    });
  });

  describe('given expense breakdown rows grouped by vendor', () => {
    it('displays vendor names and expense amounts', () => {
      const vendorRows: ExpenseBreakdownRow[] = [
        { vendorId: 'v-1', vendorName: 'CloudHost Inc', expenseAmount: 8000, transactionCount: 4, avgTransactionAmount: 2000 },
        { vendorId: 'v-2', vendorName: 'Office Supplies Co', expenseAmount: 3000, transactionCount: 6, avgTransactionAmount: 500 },
      ];
      render(
        <BreakdownTable rows={vendorRows} groupBy="vendor" />
      );

      expect(screen.getByText('CloudHost Inc')).toBeInTheDocument();
      expect(screen.getByText('Office Supplies Co')).toBeInTheDocument();
      expect(screen.getByText('$8,000')).toBeInTheDocument();
    });

    it('shows Expense Amount as the column header', () => {
      const vendorRows: ExpenseBreakdownRow[] = [
        { vendorId: 'v-1', vendorName: 'CloudHost Inc', expenseAmount: 8000, transactionCount: 4, avgTransactionAmount: 2000 },
      ];
      render(
        <BreakdownTable rows={vendorRows} groupBy="vendor" />
      );

      expect(screen.getByText('Expense Amount')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
    });
  });

  describe('given expense breakdown rows grouped by category', () => {
    it('displays category names for expense rows', () => {
      const catRows: ExpenseBreakdownRow[] = [
        { categoryId: 'ec-1', categoryName: 'Legal', expenseAmount: 15000, transactionCount: 3, avgTransactionAmount: 5000 },
      ];
      render(
        <BreakdownTable rows={catRows} groupBy="category" />
      );

      expect(screen.getByText('Legal')).toBeInTheDocument();
    });
  });

  describe('given a row with no name fields', () => {
    it('falls back to a dash for the label', () => {
      const noNameRows: RevenueBreakdownRow[] = [
        { revenueAmount: 5000, invoiceCount: 1, avgInvoiceValue: 5000, paymentCollectedAmount: 5000 },
      ];
      render(
        <BreakdownTable rows={noNameRows} groupBy="customer" />
      );

      // The name column should render a dash
      const rows = screen.getAllByTestId('breakdown-table-row');
      expect(rows[0]).toHaveTextContent('—');
    });
  });

  describe('given an empty rows array', () => {
    it('renders an empty state with data-testid="breakdown-table-empty"', () => {
      render(
        <BreakdownTable
          rows={[]}
          groupBy="customer"
        />
      );

      expect(screen.getByTestId('breakdown-table-empty')).toBeInTheDocument();
    });

    it('does NOT render the table element', () => {
      render(
        <BreakdownTable
          rows={[]}
          groupBy="customer"
        />
      );

      expect(screen.queryByTestId('breakdown-table')).not.toBeInTheDocument();
    });
  });

  describe('given an onRowClick handler is provided', () => {
    it('calls onRowClick with the row data when a row is clicked', () => {
      const handleRowClick = vi.fn();
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCustomer}
          groupBy="customer"
          onRowClick={handleRowClick}
        />
      );

      const rows = screen.getAllByTestId('breakdown-table-row');
      fireEvent.click(rows[0]);

      expect(handleRowClick).toHaveBeenCalledOnce();
      expect(handleRowClick).toHaveBeenCalledWith(mockRevenueBreakdownByCustomer[0]);
    });
  });

  describe('given a row with null avgInvoiceValue', () => {
    it('renders a dash instead of null for avgInvoiceValue', () => {
      const rowsWithNull: RevenueBreakdownRow[] = [
        {
          customerId: 'cust-1',
          customerName: 'Acme Corp',
          revenueAmount: 5000,
          invoiceCount: 0,
          avgInvoiceValue: null,
          paymentCollectedAmount: 0,
        },
      ];

      render(
        <BreakdownTable
          rows={rowsWithNull}
          groupBy="customer"
        />
      );

      expect(screen.getByTestId('avg-invoice-null')).toBeInTheDocument();
    });
  });

  describe('given the revenue column header is clicked', () => {
    it('sorts rows by revenueAmount ascending on second click', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCustomer}
          groupBy="customer"
        />
      );

      const revenueHeader = screen.getByTestId('col-header-revenue');
      // First click — ascending
      fireEvent.click(revenueHeader);

      const rows = screen.getAllByTestId('breakdown-table-row');
      // Lowest revenue first: Gamma LLC (12000)
      expect(rows[0]).toHaveTextContent('Gamma LLC');
    });

    it('sorts rows by revenueAmount descending on second click after first', () => {
      render(
        <BreakdownTable
          rows={mockRevenueBreakdownByCustomer}
          groupBy="customer"
        />
      );

      const revenueHeader = screen.getByTestId('col-header-revenue');
      fireEvent.click(revenueHeader); // asc
      fireEvent.click(revenueHeader); // desc

      const rows = screen.getAllByTestId('breakdown-table-row');
      // Highest revenue first: Acme Corp (45000)
      expect(rows[0]).toHaveTextContent('Acme Corp');
    });
  });
});
