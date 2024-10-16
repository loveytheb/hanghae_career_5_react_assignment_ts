import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { Truck } from 'lucide-react';

import { AddressTableRow } from '@/pages/purchase/components/AddressTableRow';
import { NameTableRow } from '@/pages/purchase/components/NameTableRow';
import { PhoneTableRow } from '@/pages/purchase/components/PhoneTableRow';
import { RequestsTableRow } from '@/pages/purchase/components/RequestsTableRow';
import { FormData, FormErrors } from '../index';
import { useCallback } from 'react';

interface PhoneTableRowProps {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  errors: FormErrors;
}

export const ShippingInformationForm = ({
  formData,
  onChange,
  errors,
}: PhoneTableRowProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e);
    },
    [onChange]
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-6 w-6" />
          배송 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <NameTableRow value={formData.name} onChange={handleChange} />
            <AddressTableRow value={formData.address} onChange={handleChange} />
            <PhoneTableRow value={formData.phone} onChange={handleChange} />
            <RequestsTableRow
              value={formData.requests}
              onChange={handleChange}
            />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
