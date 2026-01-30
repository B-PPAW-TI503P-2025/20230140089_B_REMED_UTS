const checkRole = (requiredRole) => {
    return (req, res, next) => {
       
        const role = req.headers['x-user-role'];
        console.log(`[Middleware] Checking role. Required: ${requiredRole}, Found: ${role}`);

        if (!role) {
            return res.status(401).json({ 
                message: "Akses ditolak: Header x-user-role tidak ditemukan" 
            });
        }
        
        if (role.toLowerCase() !== requiredRole.toLowerCase()) {
            return res.status(403).json({ 
                message: `Akses ditolak: Anda login sebagai ${role}, butuh akses ${requiredRole}` 
            });
        }
        
        next();
    };
};

module.exports = { checkRole };