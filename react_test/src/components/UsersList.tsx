import {User} from "../api/user.ts"
import {TableContainer, TableHead, Paper, TableBody, TableRow} from "@mui/material";

interface UsersListProps {
    items: User[]
}

const UsersList = ({ items }: UsersListProps) => {

    const rows = items.map(() => {
        return (
            <TableRow>
                <TableCell>MtrNr</TableCell>
                <TableCell>Vorname</TableCell>
                <TableCell>Nachname</TableCell>
                <TableCell>UserName</TableCell>
            </TableRow>
        )
    })

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>MtrNr</TableCell>
                        <TableCell>Vorname</TableCell>
                        <TableCell>Nachname</TableCell>
                        <TableCell>UserName</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {rows}

                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default UsersList